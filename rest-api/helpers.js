/**
 * This module provides utility functions for NFC card transactions, including
 * generating secure handshakes, updating handshakes in conjunction with transactions,
 * and setting expiry dates for cards. It utilizes cryptographic methods for enhanced
 * security and interacts with a database to update card information.
 *
 * @module NFCUtilities
 *
 * @author Simon Marcel Linden
 * @version 1.0.0
 * @since 1.0.0
 *
 * @requires crypto: Node.js Crypto module to generate secure random bytes for handshakes.
 * @requires ./database/database: Custom module to interact with the application's database.
 */

const crypto = require('crypto');
const db = require('./database/database');

/**
 * Generates a secure, random handshake token using cryptographic methods.
 *
 * @function generateHandshake
 * @returns {string} A 40-character hexadecimal string representing the handshake token.
 */
function generateHandshake() {
	return crypto.randomBytes(6).toString('hex');
};

/**
 * Updates the handshake token for an NFC card and applies a transaction (charge or debit)
 * to the card's balance. It ensures that debits only occur if sufficient balance exists.
 *
 * @async
 * @function updateHandshakeAndTransact
 * @param {string} cardId - The unique identifier of the NFC card.
 * @param {number} amount - The amount to charge or debit from the card.
 * @param {boolean} isCharge - True if the operation is a charge, false if it is a debit.
 * @param {Object} res - The Express response object to send feedback to the client.
 * @returns {Promise<void>} A promise that resolves with no value but sends an HTTP response indicating the transaction outcome.
 */
async function updateHandshakeAndTransact(cardId, amount, isCharge, res) {
	const newHandshake = generateHandshake();
	const balanceChange = isCharge ? amount : -amount;
	const query = `UPDATE nfc_cards SET balance = balance + ?, handshake = ? WHERE card_id = ? AND balance >= ?`;

	try {
		const result = await db.query(query, [balanceChange, newHandshake, cardId, isCharge ? 0 : amount]);
		if (result.affectedRows === 0) {
			return res.status(404).send('Card not found, handshake invalid, or insufficient balance.');
		}
		return res.send({ cardId, newHandshake, message: `Transaction successful. New handshake: ${newHandshake}` });
	} catch (err) {
		console.error(err);
		return res.status(500).send('Error during the transaction.');
	}
}

/**
 * Calculates and sets the expiry date for an NFC card based on a specified number of days from a given date.
 *
 * @function setExpiryDate
 * @param {Date} date - The starting date from which to calculate the expiry date.
 * @param {number} days - The number of days after the starting date when the card should expire.
 * @returns {Date} The calculated expiry date.
 */
function setExpiryDate(date, days) {
	const result = new Date(date);
	result.setDate(result.getDate() + days);
	return result;
}

module.exports = {
	generateHandshake,
	updateHandshakeAndTransact,
	setExpiryDate
};
