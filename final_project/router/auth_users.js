const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
}

// Only registered users can login
regd_users.post("/login", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
  
    // Check if username and password were provided
    if (!username || !password) {
        return res.status(404).json({message: "Error logging in"});
    }
  
    // Find if there is a matching user in our database
    let validusers = users.filter((user) => {
        return (user.username === username && user.password === password);
    });
  
    // If a match is found
    if (validusers.length > 0) {
        // Generate a JWT token
        let accessToken = jwt.sign({
            data: password
        }, 'access', { expiresIn: 60 * 60 });
  
        // Save the token and username to the session
        req.session.authorization = {
            accessToken, username
        }
        return res.status(200).send("Customer successfully logged in");
    } else {
        return res.status(208).json({message: "Invalid Login. Check username and password"});
    }
  });

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const review = req.query.review; // We grab the review from the URL query
    const username = req.session.authorization['username']; // We grab the username from the session

    // Check if the book exists
    if (books[isbn]) {
        // Add or update the review for this specific user
        books[isbn].reviews[username] = review;
        return res.status(200).send(`The review for the book with ISBN ${isbn} has been added/updated.`);
    } else {
        return res.status(404).json({message: "Book not found"});
    }
});
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.session.authorization['username'];

    if (books[isbn]) {
        // Delete the specific user's review for this book
        delete books[isbn].reviews[username];
        return res.status(200).send(`Reviews for the ISBN ${isbn} posted by the user ${username} deleted.`);
    } else {
        return res.status(404).json({message: "Book not found"});
    }
});
module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
