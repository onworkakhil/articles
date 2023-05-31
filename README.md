# articles


# My Project

This is a backend RESTful API project built with Node.js, Express.js, and MongoDB. It provides user authentication and article management functionalities.

## Installation

To run this project locally, please follow these steps:

1. Clone the repository to your local machine:


   git clone git@github.com:onworkakhil/articles.git


2.Install the dependencies using npm:

  npm install


3.Update the MongoDB connection string in connection/db.js

  MONGODB_URI=<your_mongodb_connection_string>


4. Run server

  node server.js



The API endpoints and their usage are as follows:

-POST /api/signup: Register a new user. Required fields: email, password, name, age.

-POST /api/login: Authenticate a user and generate a JWT token. Required fields: email, password.

-POST /api/users/:userId/articles: Create a new article. This is a protected route and requires a valid JWT token in the Authorization header. Required fields: title, description.

-GET /api/articles: Fetch all articles. This is a protected route and requires a valid JWT token in the Authorization header.

-PUT /api/users/:userId: Update a user's profile. This is a protected route and requires a valid JWT token in the Authorization header. Required fields: name, age.


