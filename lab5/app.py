from flask import Flask, render_template, request, redirect, url_for, jsonify, send_from_directory
import os
import json

app = Flask(__name__)

# File path to store books data
books_file_path = 'books.json'

# Load books from the JSON file
def load_books():
    if os.path.exists(books_file_path):
        with open(books_file_path, 'r') as f:
            return json.load(f)
    return []

# Save books to the JSON file
def save_books(books):
    with open(books_file_path, 'w') as f:
        json.dump(books, f)

# Serve the main page
@app.route('/')
def index():
    books = load_books()
    return render_template('index.html', books=books)

# Serve the create book page
@app.route('/create')
def create():
    return render_template('create.html')

# Serve the edit book page
@app.route('/edit/<int:index>')
def edit(index):
    books = load_books()
    if 0 <= index < len(books):
        return render_template('edit.html', book=books[index], index=index)
    return "Book not found", 404

# Create a new book
@app.route('/books', methods=['POST'])
def create_book():
    books = load_books()
    new_book = {
        'title': request.form['title'],
        'description': request.form['description'],
        'price': float(request.form['price']),
        'img': request.form['imagePath'] or 'image/default.jpg'
    }
    books.append(new_book)
    save_books(books)
    return redirect(url_for('index'))

# Edit a book
@app.route('/books/<int:index>', methods=['PUT'])
def edit_book(index):
    books = load_books()
    book = books[index]
    book['title'] = request.json['title']
    book['description'] = request.json['description']
    book['price'] = request.json['price']
    book['img'] = request.json['imagePath']
    save_books(books)
    return jsonify(book)

# Remove a book
@app.route('/books/<int:index>', methods=['DELETE'])
def delete_book(index):
    books = load_books()
    books.pop(index)
    save_books(books)
    return '', 204

# Serve static files
@app.route('/css/<path:path>')
def send_css(path):
    return send_from_directory('css', path)

@app.route('/js/<path:path>')
def send_js(path):
    return send_from_directory('js', path)

@app.route('/image/<path:path>')
def send_image(path):
    return send_from_directory('image', path)

# Run the application
if __name__ == '__main__':
    app.run(debug=True)
