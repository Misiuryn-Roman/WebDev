const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'lab5')));

const loadBooks = () => {
    try {
        const data = fs.readFileSync('books.json');
        return JSON.parse(data);
    } catch (error) {
        return [];
    }
};

const saveBooks = (books) => {
    fs.writeFileSync('books.json', JSON.stringify(books, null, 2));
};

app.get('/api/books', (req, res) => {
    let { sortByPrice, search } = req.query;
    const books = loadBooks();
    // search = search.toLowerCase();

    let result = books.filter((book) => {
        if ( !search?.length ) {
            return true;
        }
        // return book.includes(search);
    })
    .sort((a, b) => {
        return sortByPrice == "asc" ? b.price - a.price : a.price - b.price;
    });

    res.json(result);
});

app.post('/api/books', (req, res) => {
    const books = loadBooks();
    books.push(req.body);
    saveBooks(books);
    res.status(201).json(req.body);
});

app.put('/api/books/:index', (req, res) => {
    const books = loadBooks();
    const index = req.params.index;
    if (books[index]) {
        books[index] = req.body;
        saveBooks(books);
        res.json(req.body);
    } else {
        res.status(404).send('Book not found');
    }
});

app.delete('/api/books/:index', (req, res) => {
    const books = loadBooks();
    const index = req.params.index;
    if (books[index]) {
        books.splice(index, 1);
        saveBooks(books);
        res.status(204).send();
    } else {
        res.status(404).send('Book not found');
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
