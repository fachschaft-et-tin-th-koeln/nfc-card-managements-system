const express = require('express');
const router = express.Router();

const db = require('../database/database');

router.get('/', async (req, res) => {
	let query = 'SELECT * FROM nfc_products WHERE `active` = ? ORDER BY `type` ASC';
	const active = req.query.active || 2;

	try {
		if (active == 1 || active == true) {
			query = 'SELECT * FROM nfc_products WHERE `active` = 1 ORDER BY `type` ASC';
		} else if (active == 0 || active == false) {
			query = 'SELECT * FROM nfc_products WHERE `active` = 0 ORDER BY `type` ASC';
		} else {
			query = 'SELECT * FROM nfc_products ORDER BY `type` ASC';
		}

		const results = await db.query(query);
		if (results.length === 0) {
			return res.status(404).send('Keine Producte vorhanden.');
		}
		return res.send(results);
	} catch (err) {
		console.error(err); // Es ist eine gute Praxis, den Fehler auch zu loggen.
		return res.status(500).send({ message: 'Fehler beim Abfragen der Produkte.', error: err.message });
	}
});


module.exports = router;
