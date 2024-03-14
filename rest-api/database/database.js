/**
 * This module configures a MySQL database connection pool and provides a utility
 * function for executing SQL queries. It leverages environment variables for
 * database connection details, supporting scalable and secure configurations.
 * The module encapsulates database interactions, offering a simplified interface
 * for executing queries within the application.
 *
 * @module Database
 *
 * @author Simon Marcel Linden
 * @version 1.0.0
 * @since 1.0.0
 *
 * @requires mysql: A Node.js client for the MySQL database. It enables interaction
 *         with MySQL databases to execute queries, insert data, and manage database
 *         operations.
 */

const mysql = require('mysql');

/**
 * Creates a MySQL connection pool with a predefined connection limit and
 * configuration details sourced from environment variables. This approach
 * enhances performance and resource management for database operations.
 */
const pool = mysql.createPool({
	connectionLimit: 10, // Maximum number of connections in the pool
	host: process.env.DB_HOST, // Database host address
	user: process.env.DB_USER, // Database user
	password: process.env.DB_PASSWORD, // Database password
	database: process.env.DB_DATABASE // Database name
});

/**
 * Executes a SQL query using the connection pool and returns a promise.
 * This function abstracts the callback-based API of the mysql module into
 * a promise-based interface, facilitating the use of async/await syntax
 * for database operations.
 *
 * @function query
 * @param {string} sql - The SQL query string to be executed.
 * @param {Array} [params=[]] - Optional parameters to be included with the query for prepared statements.
 * @returns {Promise<Object>} A promise that resolves with the query results or rejects with an error.
 */
const query = (sql, params) => {
	return new Promise((resolve, reject) => {
		pool.query(sql, params, (err, results) => {
			if (err) {
				reject(err); // Rejects the promise with the encountered error
			} else {
				resolve(results); // Resolves the promise with the query results
			}
		});
	});
};

module.exports = { query };
