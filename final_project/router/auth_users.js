const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
    let valid = true;
    users.map(user=>{
        if(user.username===username){
            valid=false;
        }
    })
    return valid;
}

const authenticatedUser = (username,password)=>{ 
    let valid=false;
    users.map(user=>{
        if(user.username===username&&user.password==password){
            valid=true
        }
    })
    return valid;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
  
    if (!username || !password) {
        return res.status(404).json({message: "Missing credentials"});
    }
   if (authenticatedUser(username,password)) {
        let accessToken = jwt.sign({
            data: password
        }, 'fingerprint_customer', { expiresIn: 60 * 60 });
    
        req.session.authorization = {
            accessToken,username
        }
        return res.status(200).send("User successfully logged in");
    } 
    else {
      return res.status(208).json({message: "Invalid Login. Check username and password"});
    }});
  

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    if (!req.session.authorization) {
      return res.status(401).json({message: "User not authorized for this action"});
    }
  
    let username = req.session.authorization.username;
    let isbn = req.params.isbn;
  
    if (books[isbn]) {
      books[isbn].reviews[username] = req.body.review;
      return res.status(200).send("Review successfully added");
    } else {
      return res.status(400).json({message: "No book with this isbn found"});
    }
  });

  regd_users.delete("/auth/review/:isbn", (req, res) => {
    if (!req.session.authorization) {
      return res.status(401).json({message: "User not authorized for this action"});
    }
  
    let username = req.session.authorization.username;
    let isbn = req.params.isbn;
  
    if (books[isbn]) {
        if(books[isbn].reviews[username]){
            delete books[isbn].reviews[username]
            return res.status(200).send("Review successfully deleted");
        }
        else{
            return res.status(404).json({message: "No reviews from this user for this book"});
        }
    } 
    else {
      return res.status(404).json({message: "No book with this isbn found"});
    }
  });

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
