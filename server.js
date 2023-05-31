require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const connectDB = require('./connection/db');
const expressListEndpoints = require('express-list-endpoints');

// Import routes
const usersRoutes = require('./routes/users');
const articlesRoutes = require('./routes/articles');

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(bodyParser.json());

// Use routes
app.use(usersRoutes);
app.use(articlesRoutes);

// This is a simple route for testing
app.get('/', (req, res) => {
    res.send('Hello, World!');
});

console.log(expressListEndpoints(app));

// Error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// Start the server
const PORT = process.env.PORT || 4002;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
