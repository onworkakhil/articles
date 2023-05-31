const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const standardApiResponse = require('../utils/responses');  // adjust the path as needed

// middleware for verifying JWT
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) return standardApiResponse(res, 401, null, 'Unauthorized', true);

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return standardApiResponse(res, 403, null, 'Forbidden', true);
        req.user = user;
        next();
    });
}

// POST /api/signup
router.post('/signup', async (req, res) => {
    const { email, password, name, age } = req.body;

    try {
        // Check if user already exists
        let user = await User.findOne({ email });
        if (user) {
            return standardApiResponse(res, 400, null, 'User already exists', true);
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        user = new User({
            email,
            password: hashedPassword,
            name,
            age
        });
        await user.save();

        standardApiResponse(res, 200, { message: 'User created successfully' });
    } catch (err) {
        standardApiResponse(res, 500, null, err.message, true);
    }
});

// POST /api/login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return standardApiResponse(res, 400, null, 'Invalid email or password', true);
        }

        // Compare the password
        bcrypt.compare(password, user.password, (err, result) => {
            if (err) {
                // Handle bcrypt error
                return standardApiResponse(res, 500, null, err.message, true);
            }

            if (!result) {
                // Invalid password
                return standardApiResponse(res, 400, null, 'Invalid email or password', true);
            }

            // Create JWT token
            const payload = { userId: user.id };
            const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

            standardApiResponse(res, 200, { token }, 'Login successful');
        });
    } catch (err) {
        // Handle other errors
        standardApiResponse(res, 500, null, err.message, true);
    }
});


router.put('/api/users/:userId', authenticateToken, async (req, res) => {
    const { name, age } = req.body;
    const { userId } = req.params;


    try {
        const user = await User.findById(userId);

        if (!user) {
            return standardApiResponse(res, 404, null, 'User not found', true);
        }

        if (user._id.toString() !== req.user._id) {
            return standardApiResponse(res, 403, null, 'Cannot update another user\'s profile', true);
        }

        user.name = name;
        user.age = age;

        await user.save();

        standardApiResponse(res, 200, { message: 'Profile updated successfully' });
    } catch (err) {
        standardApiResponse(res, 500, null, 'Server error', true);
    }
});

module.exports = router;
