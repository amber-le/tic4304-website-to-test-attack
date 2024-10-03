const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');
const {check, validationResult} = require('express-validator');
const cors = require('cors');

// Initialize environment variables
dotenv.config();

const app = express();
const port = 3001;

app.use(cors());
// Middleware to parse request body
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// Serve static HTML files
app.use(express.static('public'));

// Create MySQL connection
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

// Connect to the database
db.connect((err) => {
    if (err) {
        console.error('Database connection failed:', err.stack);
        return;
    }
    console.log('Connected to MySQL database');
});

// Handle form submission from the registration page
app.post('/register', [
    // check('name').notEmpty().withMessage('Name is required'),
    // check('email').isEmail().withMessage('Email is not valid'),
    // check('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    // //check password and confirm password are same
    // check('confirm_password').custom((value, { req }) => {
    //     if (value !== req.body.password) {
    //         throw new Error('Password confirmation does not match password');
    //     }
    //     return true;
    // }),
], async (req, res) => {
    const errors = validationResult(req);
    // if (!errors.isEmpty()) {
    //     return res.status(400).json({ errors: errors.array() });
    // }

    const {full_name, email_address, password} = req.body;
    console.log(req.body);

    try {
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert the data into the MySQL database
        const query = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';
        db.query(query, [full_name, email_address, hashedPassword], (err, result) => {
            if (err) {
                console.error('Error saving user data:', err);
                if (err.code === 'ER_DUP_ENTRY') {
                    return res.status(400).json({message: 'Email already exists'});
                }
                return res.status(500).json({message: 'Error registering user'});
            }

            res.json({message: 'User registered successfully'});
        });
    } catch (err) {

        // console.error(err);

        // response json with message field
        return res.status(500).json({message: 'Error registering user'});
    }
});


// Start the server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);

});
//connect to the database for login page
app.post('/login', (req, res) => {
    const {email_address, password} = req.body;
    console.log(req.body);
    // Check if the user exists
    const query = 'SELECT * FROM users WHERE email = ?';
    db.query(query, [email_address], async (err, results) => {
        if (err) {
            console.error('Error retrieving user data:', err);
            return res.status(500).json({message: 'Error logging in'});
        }

        if (results.length === 0) {
            return res.status(400).json({message: 'Invalid email or password'});
        }

        // Check if the password is correct
        const user = results[0];
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({message: 'Invalid email or password'});
        }
        // create new user token and install in the database user-token with expiry date 7 days, don't use jwt, use
        // randome string
        const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        const query = 'INSERT INTO user_token (email, expire_time, token) VALUES (?, DATE_ADD(NOW(), INTERVAL 7' +
            ' DAY),  ?)';
        db.query(query, [email_address, token], (err, result) => {
                if (err) {
                    console.error('Error saving user token:', err);
                    return res.status(500).json({message: 'Error logging in'});
                }
            }
        );

        res.json({message: 'User logged in successfully', token});
    });
});
//submit the form.html to the database
app.post('/form', (req, res) => {
        const {full_name, email_address, phone_number, country, gender, qualification} = req.body;
        console.log(req.body);
        try {
            // Insert the data into the MySQL database
            const query = 'INSERT INTO form (full_name, email, phone_number, country, gender, qualification) VALUES (?, ?, ?, ?, ?, ?)';
            db.query(query, [full_name, email_address, phone_number, country, gender, qualification], (err, result) => {
                    if (err) {
                        console.error('Error saving form data:', err);
                        if (err.code === 'ER_DUP_ENTRY') {
                            return res.status(400).json({message: 'Email already exists, please use another email'});
                        }
                        return res.status(500).json({message: 'Error submitting form'});
                    }
                    res.json({message: 'Form submitted successfully'});

                }
            );
        } catch (err) {
            console.error(err);
            return res.status(500).json({message: 'Error submitting form'});
        }
    }
);

app.post('/logout', (req, res) => {
    const {token} = req.body;
    console.log(req.body);
    const query = 'DELETE FROM user_token WHERE token = ?';
    db.query(query, [token], (err, result) => {
        if (err) {
            console.error('Error deleting user token:', err);
            return res.status(500).json({message: 'Error logging out'});
        }
        res.json({message: 'User logged out successfully'});
    });

}
);