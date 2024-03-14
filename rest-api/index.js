/**
 * Main server file for a Node.js application that sets up an Express server with CORS support,
 * Socket.IO for real-time bidirectional event-based communication, and routes for managing settings,
 * NFC cards, and products. This file includes configuration for environmental variables, error handling,
 * and the server's listening port.
 *
 * The server allows for real-time interactions with clients through WebSockets and offers a REST API
 * for managing application settings, NFC card interactions, and product information.
 *
 * @fileOverview Main server configuration and setup for the application.
 *
 * @author Simon Marcel Linden
 * @version 1.0.0
 * @since 1.0.0
 *
 * @requires dotenv: A module that loads environment variables from a .env file into process.env.
 * @requires express: Fast, unopinionated, minimalist web framework for Node.js.
 * @requires cors: A package to enable CORS (Cross-Origin Resource Sharing) with various options.
 * @requires http: HTTP interfaces in Node.js to create an HTTP server.
 * @requires socket.io: Enables real-time, bidirectional and event-based communication between web clients and servers.
 */

// Loads environment variables from a .env file into process.env
require('dotenv').config();

// Web framework for creating the API endpoints
const express = require('express');
// Middleware to enable CORS
const cors = require('cors');

// Importing Node's native HTTP module to create an HTTP server
const http = require('http');

// Importing route handlers
const nfcCardsRoutes = require('./routes/nfc-cards.routes');

// Server configuration
const PORT = process.env.APP_PORT || 3000;
const app = express();

/** Middleware **/

// Parses incoming JSON requests and puts the parsed data in req.body
app.use(express.json());
// Enables CORS for all domains
app.use(cors());

// Route middlewares
app.use('/api/nfc-cards', nfcCardsRoutes); 	// Routes for NFC card interactions

// Creating an HTTP server that uses the Express app
const server = http.createServer(app);

// Middleware for error handling
app.use((err, req, res, next) => {
	console.error(err.stack);
	res.status(500).send('Etwas ist schief gelaufen!');
});

// Starting the server
server.listen(PORT, () => {
	console.log(`Server läuft auf Port ${PORT}`);
});

