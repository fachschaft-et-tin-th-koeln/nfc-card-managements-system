# NFC Card Management System

This repository contains a Node.js application designed for managing NFC cards, product information, and real-time communication between clients and servers using Socket.IO. It offers RESTful APIs for settings, NFC card operations, and product management, making it a comprehensive solution for NFC card-related functionalities.

## Features

- **NFC Card Initialization and Management**: Create and manage NFC cards with unique identifiers and handshakes.
- **Product Management**: Add, update, and delete product information.
- **Real-Time Communication**: Utilize Socket.IO for real-time communication between the server and clients.
- **Settings Management**: Configure and retrieve application settings.
- **CORS Support**: Fully configurable CORS support to allow cross-origin requests.
- **Environment Variable Support**: Use `.env` file for easy configuration of the application environment.

## Prerequisites

Before you begin, ensure you have installed:
- [Node.js](https://nodejs.org/en/) (version 12.x or higher recommended)
- [npm](https://www.npmjs.com/) (usually comes with Node.js)

## Installation

Clone the repository and install its dependencies:

```bash
git clone https://github.com/fachschaft-et-tin-th-koeln/nfc-card-managements-system.git
cd nfc-card-managements-system
npm install
```

## Configuration

Create a `.env` file in the root directory of your project. Add environment-specific variables on new lines in the form of `NAME=VALUE`. For example:

```env
APP_PORT=3000
DB_HOST=localhost
DB_USER=myuser
DB_PASS=mypassword
DB_NAME=mydatabase
```

## Running the Application

To start the server, run:

```bash
npm start
```

The server will start listening on the port defined in your `.env` file, defaulting to port 3000.

## Using the API

After starting the server, you can access the RESTful API endpoints under `/api` path, and connect to the Socket.IO server for real-time communications.

### REST API Endpoints

- **Settings**: `GET` and `POST` to `/api/settings` for managing application settings.
- **NFC Cards**: `POST` to `/api/nfc-cards/init` for initializing NFC cards, and more.
- **Products**: `GET`, `POST`, `PUT`, `DELETE` to `/api/products` for product management.

### Socket.IO

Connect to the Socket.IO server at the root URL (`http://localhost:3000` by default) to listen for real-time events such as `connection` and `disconnect`.

## Contributing

Contributions are welcome! For major changes, please open an issue first to discuss what you would like to change.

## License

[MIT](https://choosealicense.com/licenses/mit/)

## Author

Simon Marcel Linden
