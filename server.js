const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'lakshmi',
  database: 'task' // Adjust to your database name
});

connection.connect((err) => {
  if (err) throw err;
  console.log('Connected to MySQL database');
});

app.post('/register', async (req, res) => {
  const { firstName, lastName, email, age, password, phoneNumber } = req.body;

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  const query = 'INSERT INTO user (firstName, lastName, email, age, password, phoneNumber) VALUES (?, ?, ?, ?, ?, ?)';
  connection.query(query, [firstName, lastName, email, age, hashedPassword, phoneNumber], (err, result) => {
    if (err) {
      console.error('Error registering user:', err); // Log the error
      res.status(500).send({ success: false, message: 'Registration failed' });
    } else {
      console.log('User registered successfully:', result); // Log the successful registration
      res.send({ success: true, message: 'Registration successful' });
    }
  });
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;

  const query = 'SELECT * FROM user WHERE username = ?'; // Adjust table name if it's not `user`
  connection.query(query, [username], async (err, results) => {
    if (err) {
      console.error('Error querying database:', err);
      res.status(500).send({ success: false, message: 'An error occurred' });
    } else {
      if (results.length > 0) {
        const user = results[0];
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (passwordMatch) {
          res.send({ success: true, message: 'Login successful' });
        } else {
          res.send({ success: false, message: 'Invalid password' });
        }
      } else {
        res.send({ success: false, message: 'User not found' });
      }
    }
  });
});

app.post('/forgot-password', (req, res) => {
  const { email } = req.body;
  const token = crypto.randomBytes(20).toString('hex');

  const query = 'UPDATE user SET resetPasswordToken = ?, resetPasswordExpires = ? WHERE email = ?';
  connection.query(query, [token, Date.now() + 3600000, email], (err, result) => {
    if (err) {
      console.error('Error setting reset token:', err);
      res.status(500).send({ success: false, message: 'Failed to set reset token' });
    } else {
      if (result.affectedRows > 0) {
        const resetLink = `http://localhost:3000/reset-password?token=${token}`;
        console.log(`Password reset link: ${resetLink}`);
        
        // Here you would send the email with the reset link
        // For example, using nodemailer:
        const transporter = nodemailer.createTransport({
          service: 'Gmail',
          auth: {
            user: 'your-email@gmail.com',
            pass: 'your-email-password'
          }
        });

        const mailOptions = {
          to: email,
          from: 'passwordreset@demo.com',
          subject: 'Password Reset',
          text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n
          Please click on the following link, or paste this into your browser to complete the process:\n\n
          ${resetLink}\n\n
          If you did not request this, please ignore this email and your password will remain unchanged.\n`
        };

        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.error('Error sending email:', error);
            res.status(500).send({ success: false, message: 'Failed to send email' });
          } else {
            res.send({ success: true, message: 'Password reset link sent to your email' });
          }
        });

      } else {
        res.send({ success: false, message: 'Email not found' });
      }
    }
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
