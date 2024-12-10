const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
    let existingUser = users.find((user) => user.username === username);
    return existingUser ? false : true;
  }
  
  const authenticatedUser = (username, password) => {
    let validUser = users.find((user) => user.username === username && user.password === password);
    return validUser ? true : false;
  }

//only registered users can login
regd_users.post("/login", (req, res) => {
    const {username, password} = req.body;
    if(!username || !password){
      return res.status(400).json({message: "Username and password are required"});
    }
  
    if(authenticatedUser(username, password)){
      let accessToken = jwt.sign({data: username}, 'access', {expiresIn: 60*60});
      req.session.authorization = {accessToken};
      return res.status(200).json({message: "User logged in successfully"});
    } else {
      return res.status(401).json({message: "Invalid username or password"});
    }
  });

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const review = req.body.review; // new review

  let book = books[isbn];
  if(!book){
    return res.status(404).json({message:"Book not found"})
  }

  const username = req.user.data;
//create empty book reviews
  if(!book.reviews){
    book.reviews = {};
  }

  book.reviews[username] = review;
  return res.status(200).json({message: "Review added/updated successfully"});
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.user.data; 
    
    
    let book = books[isbn];
    if (!book) {
      return res.status(404).json({message: "Book not found"});
    }
  
    
    if (book.reviews && book.reviews[username]) {
      
      delete book.reviews[username];
      return res.status(200).json({message: "Review deleted successfully"});
    } else {
      return res.status(404).json({message: "No review found for this user"});
    }
  });

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
