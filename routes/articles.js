const jwt = require('jsonwebtoken');
const express = require('express');
const Article = require('../models/Article');  // adjust the path as needed
const router = express.Router();
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

router.post('/api/users/:userId/articles', authenticateToken, async (req, res) => {
    const { title, description } = req.body;
    const { userId } = req.params;

    try {
        const article = new Article({
            title,
            description,
            author: userId
        });

        await article.save();

        standardApiResponse(res, 201, { message: 'Article created successfully' });
    } catch (err) {
        console.error(err.message);
        standardApiResponse(res, 500, null, 'Server error', true);
    }
});

router.get('/api/articles', authenticateToken, async (req, res) => {
    try {
        const articles = await Article.find().populate('author', '-password');
        standardApiResponse(res, 200, articles, 'Articles fetched successfully');
    } catch (err) {
        console.error(err.message);
        standardApiResponse(res, 500, null, 'Server error', true);
    }
});

module.exports = router;
