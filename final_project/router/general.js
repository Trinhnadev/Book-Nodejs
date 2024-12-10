const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const {username,password} = req.body;

  if(!username || !password){
    return res.status(409).json({message:"Username and Password are required"});
  }
  if(!isValid(username)){
    return res.status(409).json({message:"User name already exists"})
  }


  let existsUser = users.some(users => users.username === username);

  if(existsUser){
    return res.status(409).json({message:"User name already exists"})
    
  }
  users.push({
    username:username,
    password:password
}) 
return res.status(200).json({message:"user registered successfully"})
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    return res.status(200).json({books});
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async (req, res) => {
    const isbn = req.params.isbn;
  const book = books[isbn];
  if (book) {
    return res.status(200).json(book);
  } else {
    return res.status(404).json({message: "Book not found"});
  }
});



  
// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    const author = req.params.author; // Dùng req.params.author thay vì req.body.author
    const arrBooks = Object.values(books);
  
    const result = arrBooks.filter(book => book.author === author);
    if(result.length > 0) {
      return res.status(200).json(result);
    } else {
      return res.status(404).json({message:"No Book found by this author"});
    }
  });

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title
  const arrBooks = Object.values(books);

  const result = arrBooks.filter(book => book.title === title);
  if(result.length > 0){
    return res.status(200).json(result)
  }else{
    return res.status(404).json({message:"No Books found by this title"})
  }
  
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    const book = books[isbn];
    if (book && book.reviews) {
      return res.status(200).json(book.reviews);
    } else {
      return res.status(404).json({message: "No reviews found for this book"});
    }
});

module.exports.general = public_users;
