/**
 * @fileOverview This file defines routes for managing NFC cards, including initialization,
 * charging, debiting, and balance checking. It utilizes an Express router to handle HTTP requests,
 * leveraging async/await for asynchronous database interactions.
 *
 * @author Simon Marcel Linden
 * @version 1.0.0
 * @since 1.0.0
 */

const express = require('express');
const { v4: uuidv4 } = require('uuid');
const router = express.Router();
const db = require('../database/database');

const { generateHandshake, updateHandshakeAndTransact, setExpiryDate } = require('../helpers');

/**
 * Initializes a new NFC card by generating a unique UUID, a handshake, and setting an expiry date.
 * This data is then inserted into the database. The response includes the card's ID, handshake, expiry date, and a success message.
 * On failure, it sends an appropriate error message.
 *
 * @route POST /init
 * @access Public
 * @param {express.Request} req - Express HTTP request object, optionally containing an expiry date.
 * @param {express.Response} res - Express HTTP response object used to send back the initialization status.
 */
router.post('/init', async (req, res) => {

	try {
		const { cardId, balance = 10 } = req.body;
		// const cardId = uuidv4();
		const handshake = generateHandshake();
		const expiryDate = (req.body.expiryDate ? new Date(req.body.expiryDate) : setExpiryDate(new Date(), 2)).toISOString().split('T')[0];

		const query = 'INSERT INTO nfc_cards (card_id, handshake, expiry_date, balance) VALUES (?, ?, ?, ?)';

		const results = await db.query(query, [cardId, handshake, expiryDate, balance]);
		if (results.length === 0) {
			return res.status(500).send({ message: 'Error initializing the card.', 'error': results.message });
		}
		return res.status(201).send({ cardId, handshake, expiryDate: expiryDate, balance, message: 'Card initialized.' });
	} catch (error) {
		console.error(error);
		return res.status(500).send({ message: 'Error initializing the card.', 'error': error.message });
	}
});

/**
 * Charges an NFC card by validating the provided card ID and handshake, then updating the card's balance.
 * The amount to charge is specified in the request body. It responds with an updated handshake and a success message.
 * On validation or database error, it responds with an appropriate error message.
 *
 * @route POST /charge
 * @access Public
 * @param {express.Request} req - Express HTTP request object containing the card ID, amount to charge, and the current handshake.
 * @param {express.Response} res - Express HTTP response object used to send back the charging status.
 */
router.post('/charge', async (req, res) => {

	try {
		const { cardId, amount, handshake } = req.body;
		const query = 'SELECT handshake FROM nfc_cards WHERE card_id = ?';

		const results = await db.query(query, [cardId]);
		console.log("CardID: " + cardId)
		console.log(results)
		if (results.length === 0 || results[0].handshake !== handshake) {
			return res.status(500).send({ message: 'Invalid handshake or card not found.', 'error': results.message });
		}

		return updateHandshakeAndTransact(cardId, amount, true, res);
	} catch (error) {
		console.error(error);
		return res.status(500).send({ message: 'Chargin error.', 'error': error.message });
	}
});

/**
 * Debits an amount from an NFC card after validating the card ID, handshake, and ensuring the card is not expired and has sufficient balance.
 * Updates the card's balance and handshake in the database, and responds with the new handshake and a success message.
 * On failure, sends an appropriate error message.
 *
 * @route POST /debit
 * @access Public
 * @param {express.Request} req - Express HTTP request object containing the card ID, amount to debit, and the current handshake.
 * @param {express.Response} res - Express HTTP response object used to send back the debit status.
 */
router.post('/debit', async (req, res) => {
	try {
		const { cardId, amount, handshake } = req.body;
		const query = 'SELECT balance, handshake, expiry_date FROM nfc_cards WHERE card_id = ?';

		let results = await db.query(query, [cardId]);
		if (results.length === 0) {
			return res.status(500).send({ message: 'Card not found.', 'error': results.message });
		}

		const card = results[0];

		if (new Date(card.expiry_date) < new Date()) {
			return res.status(403).send({ message: 'Card expired.' });
		}

		if (card.handshake !== handshake) {
			return res.status(403).send({ message: 'Invalid handshake.' });
		}
		if (card.balance < amount) {
			return res.status(400).send({ message: 'Not enough credit.' });
		}

		const newHandshake = generateHandshake();
		const updateQuery = 'UPDATE nfc_cards SET balance = balance - ?, handshake = ? WHERE card_id = ?';

		results = await db.query(updateQuery, [amount, newHandshake, cardId]);

		res.send({ cardId, newHandshake, message: `${amount}€ successfully debited. New handshake was generated.` });
		// Todo: Insert in sales history and push new sales amount to frontend
	} catch (error) {
		console.error(error);
		return res.status(500).send({ message: 'Debit error.', 'error': error.message });
	}

});

/**
 * Retrieves the balance of an NFC card, validating the provided card ID and handshake before sending the current balance.
 * On validation or database error, it responds with an appropriate error message.
 *
 * @route GET /balance/:cardId
 * @access Public
 * @param {express.Request} req - Express HTTP request object containing the card ID in the route parameter.
 * @param {express.Response} res - Express HTTP response object used to send back the card's balance.
 */
router.get('/balance/:cardId', async (req, res) => {
	try {
		const { cardId, handshake } = req.params;
		const expiryDate = (req.body.expiryDate ? new Date(req.body.expiryDate) : setExpiryDate(new Date(), 2)).toISOString().split('T')[0];

		const query = 'SELECT balance FROM nfc_cards WHERE card_id = ?';

		const results = await db.query(query, [cardId, handshake]);

		if (results.length === 0) {
			return res.status(500).send({ message: 'Card not found.', 'error': results.message });
		}

		const card = results[0];
		if (card.handshake !== handshake) {
			return res.status(403).send({ message: 'Invalid handshake.' });
		}

		return res.send({ cardId, balance: results[0].balance });

	} catch (error) {
		console.error(error);
		return res.status(500).send({ message: 'Error initializing the card.', 'error': error.message });
	}
});

module.exports = router;
