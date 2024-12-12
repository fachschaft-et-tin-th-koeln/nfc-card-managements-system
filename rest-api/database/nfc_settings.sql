-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Erstellungszeit: 14. Mrz 2024 um 14:47
-- Server-Version: 10.11.6-MariaDB
-- PHP-Version: 8.3.1
SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";
--
-- Tabellenstruktur für Tabelle `nfc_settings`
--

CREATE TABLE `nfc_settings` (
  `id` int(11) NOT NULL,
  `slug` varchar(50) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` varchar(255) NOT NULL,
  `value` varchar(255) NOT NULL,
  `active` tinyint(1) NOT NULL DEFAULT 1
);
--
-- Daten für Tabelle `nfc_settings`
--

--
-- Indizes der exportierten Tabellen
--

--
-- Indizes für die Tabelle `settings`
--
ALTER TABLE `nfc_settings`
ADD PRIMARY KEY (`id`);
--
-- AUTO_INCREMENT für exportierte Tabellen
--

--
-- AUTO_INCREMENT für Tabelle `nfc_settings`
--
ALTER TABLE `nfc_settings`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
COMMIT;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */
;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */
;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */
;