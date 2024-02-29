const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
  
    if (username && password) {
      if (isValid(username)) { 
        users.push({"username":username,"password":password});
        return res.status(200).json({message: `User with name ${username} successfully registred. Now you can login`});
      } else {
        return res.status(404).json({message: "User already exists!"});    
      }
    } 
    return res.status(404).json({message: "Unable to register user."});
  });
  

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    return res.status(200).json({books})
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  let isbn = req.params.isbn;
  if(books[isbn]){return res.status(200).json({book: books[isbn]});}
  return res.status(404).json({message: "Book not found"});
 });
  
// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    let author = req.params.author;
    const authoredBooks = Object.values(books).filter(book => book.author === author);
  
    if (authoredBooks.length > 0) { 
      return res.status(200).json({books: authoredBooks});
    }
    return res.status(404).json({message: "No books found matching this author"});
  });

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    let title = req.params.title;
    const book = Object.values(books).filter(book => book.title === title);
  
    if (book.length > 0) { 
      return res.status(200).json({book: book});
    }
    return res.status(404).json({message: "No books found matching this title"});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  isbn = req.params.isbn;
  if(books[isbn]){return res.status(200).json({reviews: books[isbn].reviews});}
  return res.status(404).json({message: "Book not found"});
});

module.exports.general = public_users;
