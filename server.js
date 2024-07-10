const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

// MySQL connection
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'lakshmi',
  database: 'task'
});

connection.connect((err) => {
  if (err) throw err;
  console.log('Connected to MySQL database');
});

// Login endpoint
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const query = 'SELECT * FROM users WHERE username = ? AND password = ?';
  connection.query(query, [username, password], (err, results) => {
    if (err) throw err;
    if (results.length > 0) {
      res.send({ success: true, message: 'Login successful' });
    } else {
      res.send({ success: false, message: 'Invalid username or password' });
    }
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
