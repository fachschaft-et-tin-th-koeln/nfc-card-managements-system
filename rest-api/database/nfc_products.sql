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
-- Tabellenstruktur für Tabelle `nfc_products`
--

CREATE TABLE `nfc_products` (
  `id` int(11) NOT NULL,
  `slug` varchar(50) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` varchar(255) NOT NULL,
  `price` decimal(10,2) NOT NULL DEFAULT 1.00,
  `type` enum('food','beer','softdrink','wine','shots') NOT NULL DEFAULT 'softdrink',
  `quantity` int(11) DEFAULT NULL,
  `size` decimal(3,2) NOT NULL DEFAULT 0.33,
  `unit` enum('l','ml','cl') NOT NULL DEFAULT 'l',
  `active` tinyint(1) NOT NULL DEFAULT 1
) ;

--
-- Daten für Tabelle `nfc_products`
--

--
-- Indizes der exportierten Tabellen
--

--
-- Indizes für die Tabelle `products`
--
ALTER TABLE `nfc_products`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT für exportierte Tabellen
--

--
-- AUTO_INCREMENT für Tabelle `nfc_products`
--
ALTER TABLE `nfc_products`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
