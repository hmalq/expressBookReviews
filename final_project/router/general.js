const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;
  if (username && password) {
      let doesExist = users.filter((user) => user.username === username);
      if (doesExist.length > 0) {
          return res.status(404).json({message: "User already exists!"});
      } else {
          users.push({"username": username, "password": password});
          return res.status(200).json({message: "User successfully registered. Now you can login"});
      }
  }
  return res.status(404).json({message: "Unable to register user. Username and password are required."});
});

// TASK 10: Get book list using Promises
public_users.get('/', function (req, res) {
    let myPromise = new Promise((resolve, reject) => {
        resolve(books);
    });
    myPromise.then((result) => {
        return res.status(200).send(JSON.stringify(result, null, 4));
    });
});

// TASK 11: Get book details based on ISBN using Promises
public_users.get('/isbn/:isbn', function (req, res) {
    let myPromise = new Promise((resolve, reject) => {
        const isbn = req.params.isbn;
        if (books[isbn]) {
            resolve(books[isbn]);
        } else {
            reject("Book not found");
        }
    });
    myPromise.then((result) => {
        return res.status(200).send(JSON.stringify(result, null, 4));
    }).catch((error) => {
        return res.status(404).json({message: error});
    });
});

// TASK 12: Get book details based on author using Promises
public_users.get('/author/:author', function (req, res) {
    let myPromise = new Promise((resolve, reject) => {
        const targetAuthor = req.params.author;
        const matchingBooks = [];
        const isbns = Object.keys(books);
        isbns.forEach((isbn) => {
            if (books[isbn].author === targetAuthor) {
                matchingBooks.push({"isbn": isbn, "title": books[isbn].title, "reviews": books[isbn].reviews});
            }
        });
        if (matchingBooks.length > 0) {
            resolve(matchingBooks);
        } else {
            reject("No books found by that author");
        }
    });
    myPromise.then((result) => {
        return res.status(200).send(JSON.stringify(result, null, 4));
    }).catch((error) => {
        return res.status(404).json({message: error});
    });
});

// TASK 13: Get all books based on title using Promises
public_users.get('/title/:title', function (req, res) {
    let myPromise = new Promise((resolve, reject) => {
        const targetTitle = req.params.title;
        const matchingBooks = [];
        const isbns = Object.keys(books);
        isbns.forEach((isbn) => {
            if (books[isbn].title === targetTitle) {
                matchingBooks.push({"isbn": isbn, "author": books[isbn].author, "reviews": books[isbn].reviews});
            }
        });
        if (matchingBooks.length > 0) {
            resolve(matchingBooks);
        } else {
            reject("No books found by that title");
        }
    });
    myPromise.then((result) => {
        return res.status(200).send(JSON.stringify(result, null, 4));
    }).catch((error) => {
        return res.status(404).json({message: error});
    });
});

// Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
      return res.status(200).send(JSON.stringify(books[isbn].reviews, null, 4));
  } else {
      return res.status(404).json({message: "Book not found"});
  }
});

module.exports.general = public_users;