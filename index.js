const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');

const app = express();
const port = 3001;

// Use body-parser middleware to parse JSON request bodies
app.use(bodyParser.json());

// Create a connection pool to the MySQL database
const pool = mysql.createPool({
    host: 'localhost',  // Replace with your host
    user: 'root',       // Replace with your database user
    password: 'root',       // Replace with your database password
    database: 'phonebook' // Replace with your database name
});

// Endpoint to add a new contact
app.post('/contacts', (req, res) => {
    const { name, phone } = req.body;

    // Validate the input
    if (!name || !phone) {
        return res.status(400).json({ error: 'Name and phone are required' });
    }

    // Insert the new contact into the database
    pool.query(
        'INSERT INTO contacts (name, phone) VALUES (?, ?)',
        [name, phone],
        (error, results) => {
            if (error) {
                return res.status(500).json({ error: error.message });
            }
            res.status(201).json({ id: results.insertId, name, phone });
        }
    );
});

// Endpoint to get all contacts
app.get('/contacts', (req, res) => {
    pool.query('SELECT * FROM contacts', (error, results) => {
        if (error) {
            return res.status(500).json({ error: error.message });
        }
        res.json({ success: 200, msg: "all contacts", data: results });
    });
},);

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
