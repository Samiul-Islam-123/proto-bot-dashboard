const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 5500;
const cors = require('cors')
const dotenv = require('dotenv')

// Middleware
app.use(bodyParser.json());
app.use(cors());
dotenv.config();

//console.log(process.env.DB_HOST)
// MySQL connection details
const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

// Connect to MySQL
console.log("connecting to MYSQL database...")
connection.connect(error => {
    if (error) {
        console.error('MySQL connection failed: ', error);
        return;
    }
    console.log('Connected to MySQL');
});

app.get('/', (req,res) => {
  res.send("Hellow World")
})

// CREATE a new record
app.post('/deviceData', (req, res) => {
    const { startTime, serial, location1, location2, location3, endTime } = req.body;

    if (startTime && serial && location1 && location2 && location3 && endTime) {
        const sql = 'INSERT INTO device_data (startTime, serial, location1, location2, location3, endTime) VALUES (?, ?, ?, ?, ?, ?)';
        const values = [startTime, serial, location1, location2, location3, endTime];

        connection.query(sql, values, (error, results) => {
            if (error) {
                console.error('Error: ', error);
                res.status(500).send(`Error: ${error}`);
            } else {
                res.status(201).send('New record created successfully');
            }
        });
    } else {
        res.status(400).send('All fields are required');
    }
});

// READ all records
app.get('/deviceData', (req, res) => {
    console.log("User is here");
    const sql = 'SELECT * FROM device_data';
    connection.query(sql, (error, results) => {
        if (error) {
            console.error('Error: ', error);
            res.status(500).send(`Error: ${error}`);
        } else {
            res.json(results);
        }
    });
});

// READ a specific record by serial
app.get('/deviceData/:serial', (req, res) => {
    const { serial } = req.params;
    const sql = 'SELECT * FROM device_data WHERE serial = ?';
    connection.query(sql, [serial], (error, results) => {
        if (error) {
            console.error('Error: ', error);
            res.status(500).send(`Error: ${error}`);
        } else {
            res.json(results);
        }
    });
});

// UPDATE a specific record by serial
app.put('/deviceData/:serial', (req, res) => {
    const { serial } = req.params;
    const { startTime, location1, location2, location3, endTime } = req.body;

    const sql = 'UPDATE device_data SET startTime = ?, location1 = ?, location2 = ?, location3 = ?, endTime = ? WHERE serial = ?';
    const values = [startTime, location1, location2, location3, endTime, serial];

    connection.query(sql, values, (error, results) => {
        if (error) {
            console.error('Error: ', error);
            res.status(500).send(`Error: ${error}`);
        } else if (results.affectedRows === 0) {
            res.status(404).send('No record found with the given serial');
        } else {
            res.send('Record updated successfully');
        }
    });
});

// DELETE a specific record by serial
app.delete('/deviceData/:serial', (req, res) => {
    const { serial } = req.params;
    const sql = 'DELETE FROM device_data WHERE serial = ?';
    connection.query(sql, [serial], (error, results) => {
        if (error) {
            console.error('Error: ', error);
            res.status(500).send(`Error: ${error}`);
        } else if (results.affectedRows === 0) {
            res.status(404).send('No record found with the given serial');
        } else {
            res.send('Record deleted successfully');
        }
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

// Close the connection when the app is closed
process.on('SIGINT', () => {
    connection.end(err => {
        if (err) {
            console.error('Error ending the connection: ', err);
        } else {
            console.log('MySQL connection closed');
        }
        process.exit();
    });
});
