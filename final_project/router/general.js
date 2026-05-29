const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


// Register a new user
public_users.post("/register", (req,res) => {
    // Grab the username and password from the request body
    const username = req.body.username;
    const password = req.body.password;
  
    // Check if both username and password are provided
    if (username && password) {
        // Check if the user already exists in our 'users' array
        let doesExist = users.filter((user) => user.username === username);
        
        if (doesExist.length > 0) {
            return res.status(404).json({message: "User already exists!"});
        } else {
            // If the user doesn't exist, add them to the array
            users.push({"username": username, "password": password});
            return res.status(200).json({message: "User successfully registered. Now you can login"});
        }
    } else {
        // If missing username or password
        return res.status(404).json({message: "Unable to register user. Username and password are required."});
    }
  });

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    // Return the books object neatly formatted
    return res.status(200).send(JSON.stringify(books, null, 4));
  });

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    // Retrieve the ISBN from the request URL
    const isbn = req.params.isbn;
    
    // Look up the book in our database
    const book = books[isbn];
    
    if (book) {
        // If we found the book, return it
        return res.status(200).send(JSON.stringify(book, null, 4));
    } else {
        // If the book doesn't exist, return an error
        return res.status(404).json({message: "Book not found"});
    }
  });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    // Retrieve the author from the request URL
    const targetAuthor = req.params.author;
    
    // Create an empty array to hold any matching books we find
    const matchingBooks = [];
    
    // Get all the keys (ISBNs) from the books object
    const isbns = Object.keys(books);
    
    // Loop through each ISBN 
    isbns.forEach((isbn) => {
      // Check if the author of the current book matches the one we are looking for
      if (books[isbn].author === targetAuthor) {
          // If it's a match, add the book along with its ISBN to our array
          matchingBooks.push({
              "isbn": isbn,
              "title": books[isbn].title,
              "reviews": books[isbn].reviews
          });
      }
    });
    
    // If we found any books, return them
    if (matchingBooks.length > 0) {
        return res.status(200).send(JSON.stringify(matchingBooks, null, 4));
    } else {
        return res.status(404).json({message: "No books found by that author"});
    }
  });

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    // Retrieve the title from the request URL
    const targetTitle = req.params.title;
    
    // Create an empty array to hold our matches
    const matchingBooks = [];
    
    // Get all the keys (ISBNs)
    const isbns = Object.keys(books);
    
    // Loop through each book
    isbns.forEach((isbn) => {
      // Check if the title matches (note: this is exact match)
      if (books[isbn].title === targetTitle) {
          matchingBooks.push({
              "isbn": isbn,
              "author": books[isbn].author,
              "reviews": books[isbn].reviews
          });
      }
    });
    
    // Return the results
    if (matchingBooks.length > 0) {
        return res.status(200).send(JSON.stringify(matchingBooks, null, 4));
    } else {
        return res.status(404).json({message: "No books found by that title"});
    }
  });

// Get book review
public_users.get('/review/:isbn',function (req, res) {
    // Retrieve the ISBN from the request URL
    const isbn = req.params.isbn;
    
    // Look up the book in our database
    const book = books[isbn];
    
    if (book) {
        // If we found the book, return ONLY its reviews
        return res.status(200).send(JSON.stringify(book.reviews, null, 4));
    } else {
        // If the book doesn't exist, return an error
        return res.status(404).json({message: "Book not found"});
    }
  });
  // TASK 10: Get the list of books available in the shop using async-await with Axios
const getAllBooksAsync = async () => {
    try {
        const response = await axios.get('http://localhost:5000/');
        console.log("Task 10 - All Books:");
        console.log(response.data);
    } catch (error) {
        console.error("Error fetching all books:", error);
    }
};

// Call the function to test it (optional)
// getAllBooksAsync();
// TASK 11: Get book details based on ISBN using async-await with Axios
const getBookByISBNAsync = async (isbn) => {
    try {
        const response = await axios.get(`http://localhost:5000/isbn/${isbn}`);
        console.log(`Task 11 - Book Details for ISBN ${isbn}:`);
        console.log(response.data);
    } catch (error) {
        console.error("Error fetching book by ISBN:", error);
    }
};

// Call the function to test it (optional)
// getBookByISBNAsync(1);
// TASK 12: Get book details based on Author using async-await with Axios
const getBookByAuthorAsync = async (author) => {
    try {
        const response = await axios.get(`http://localhost:5000/author/${author}`);
        console.log(`Task 12 - Book Details for Author ${author}:`);
        console.log(response.data);
    } catch (error) {
        console.error("Error fetching book by author:", error);
    }
};

// Call the function to test it (optional)
// getBookByAuthorAsync("Unknown");

module.exports.general = public_users;
