const express = require("express");
const router = express.Router();

const db = require("../database/database");

router.get("/mode", async (req, res) => {
  try {
    // Ermittelt den 'mode'-Eintrag aus der Tabelle 'nfc_settings'
    const settingsQuery =
      "SELECT * FROM nfc_settings WHERE slug = ? and active = 1";
    const settingsResults = await db.query(settingsQuery, ["mode"]);

    if (settingsResults.length === 0) {
      return res.status(404).send({ message: "Mode setting not found." });
    }

    const mode = settingsResults[0].value;

    // Gibt den Modus zurück
    return res.send({ value: mode });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .send({ message: "Error fetching mode.", error: error.message });
  }
});

module.exports = router;
