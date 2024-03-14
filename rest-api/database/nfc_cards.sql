-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Erstellungszeit: 14. Mrz 2024 um 13:17
-- Server-Version: 10.11.6-MariaDB
-- PHP-Version: 8.3.1

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Datenbank: `rest_api_kassensystem`
--

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `nfc_cards`
--

CREATE TABLE `nfc_cards` (
  `card_id` varchar(255) NOT NULL,
  `balance` decimal(10,2) NOT NULL DEFAULT 0.00,
  `handshake` varchar(255) NOT NULL,
  `expiry_date` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Daten für Tabelle `nfc_cards`
--

--
-- Trigger `nfc_cards`
--
DELIMITER $$
CREATE TRIGGER `before_insert_nfc_cards` BEFORE INSERT ON `nfc_cards` FOR EACH ROW BEGIN
   SET NEW.expiry_date = ADDDATE(NOW(), INTERVAL 2 DAY);
END
$$
DELIMITER ;

--
-- Indizes der exportierten Tabellen
--

--
-- Indizes für die Tabelle `nfc_cards`
--
ALTER TABLE `nfc_cards`
  ADD PRIMARY KEY (`card_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
