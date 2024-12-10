const express = require('express');
const axios = require('axios'); // If you decide to fetch from an external API
let books = require("./booksdb.js");
const public_users = express.Router();

// Mock asynchronous functions for demonstration
function getAllBooks() {
    return new Promise((resolve, reject) => {
        // Simulate an async operation (e.g., DB query or external API)
        setTimeout(() => {
            resolve(books);
        }, 100);
    });
}
// Task 10: Get the list of books (originally done in Task 1), now async/await or using Promises
public_users.get('/', async (req, res) => {
    try {
        const allBooks = await getAllBooks();
        return res.status(200).json(allBooks);
    } catch (err) {
        return res.status(500).json({error: err.message});
    }
});

function getBookByISBN(isbn) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (books[isbn]) {
                resolve(books[isbn]);
            } else {
                reject(new Error("Book not found"));
            }
        }, 100);
    });
}
// Task 11: Get book details based on ISBN (originally done in Task 2)
public_users.get('/isbn/:isbn', async (req, res) => {
    const isbn = req.params.isbn;
    try {
        const book = await getBookByISBN(isbn);
        return res.status(200).json(book);
    } catch (err) {
        return res.status(404).json({error: err.message});
    }
});

function getBooksByAuthor(author) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            let filtered = Object.values(books).filter(book => book.author === author);
            if (filtered.length > 0) {
                resolve(filtered);
            } else {
                reject(new Error("No books found by this author"));
            }
        }, 100);
    });
}

// Task 12: Get book details based on Author (originally done in Task 3)
public_users.get('/author/:author', async (req, res) => {
    const author = req.params.author;
    try {
        const booksByAuthor = await getBooksByAuthor(author);
        return res.status(200).json(booksByAuthor);
    } catch (err) {
        return res.status(404).json({error: err.message});
    }
});

function getBooksByTitle(title) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            let filtered = Object.values(books).filter(book => 
                book.title.toLowerCase() === title.toLowerCase()
            );
            if (filtered.length > 0) {
                resolve(filtered);
            } else {
                reject(new Error("No books found with this title"));
            }
        }, 100);
    });
}
// Task 13: Get book details based on Title (originally done in Task 4)
public_users.get('/title/:title', async (req, res) => {
    const title = req.params.title;
    try {
        const booksByTitle = await getBooksByTitle(title);
        return res.status(200).json(booksByTitle);
    } catch (err) {
        return res.status(404).json({error: err.message});
    }
});



module.exports.general = public_users;
