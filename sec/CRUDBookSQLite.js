// SQLite3 CRUD operations

// Create a Bood.sqlite file in Database folder
// npm install sqlite3
// Run this file with node CRUDBookSQLite.js    // Test with Postman

const express = require('express');
const app = express();
const sqlite3 = require('sqlite3');

// connect to database
const db = new sqlite3.Database('./Database/Book.sqlite');

app.use(express.json()); // parse incoming requests

// create books table if it doesn't exist
db.run(`CREATE TABLE IF NOT EXISTS books (
    id INTEGER PRIMARY KEY,
    title TEXT,
    author TEXT
)`);

// route to get all books
app.get('/books', (req, res) => {
    db.all('SELECT * FROM books', [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(200).json(rows);
    });
});

// route to get a book by id
app.get('/books/:id', (req, res) => {
    const id = req.params.id;
    db.get('SELECT * FROM books WHERE id = ?', [id], (err, row) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (row) {
            res.status(200).json(row);
        } else {
            res.status(404).json({ message: 'Book not found' });
        }
    });
});

// route to create a new book
app.post('/books', (req, res) => {
    const { title, author } = req.body;
    if (!title || !author) {
        return res.status(400).json({ message: 'Title and author are required' });
    }
    db.run('INSERT INTO books (title, author) VALUES (?, ?)', [title, author], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ id: this.lastID, message: 'Book created successfully' });
    });
});

// route to update a book
app.put('/books/:id', (req, res) => {
    const id = req.params.id;
    const { title, author } = req.body;
    db.run('UPDATE books SET title = ?, author = ? WHERE id = ?', [title, author, id], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(200).json({ message: 'Book updated successfully' });
    });
});

// route to delete a book
app.delete('/books/:id', (req, res) => {
    const id = req.params.id;
    db.run('DELETE FROM books WHERE id = ?', [id], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(200).json({ message: 'Book deleted successfully' });
    });
});

app.listen(3000, () => {
    console.log('Server is listening on port 3000');
});
