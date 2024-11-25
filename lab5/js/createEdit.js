document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('bookForm');
    const urlParams = new URLSearchParams(window.location.search);
    const isEditPage = window.location.pathname.includes('edit');
    const bookIndex = urlParams.get('index');

    const loadBooks = async () => {
        const response = await fetch('/api/books');
        return response.json();
    };

    const fillForm = async () => {
        const books = await loadBooks();
        if (isEditPage && bookIndex !== null) {
            const book = books[bookIndex];
            document.getElementById('title').value = book.title;
            document.getElementById('description').value = book.description;
            document.getElementById('price').value = book.price;
            document.getElementById('imagePath').value = book.img;
        }
    };

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const title = document.getElementById('title').value;
        const description = document.getElementById('description').value;
        const price = parseFloat(document.getElementById('price').value);
        const imagePath = document.getElementById('imagePath').value || 'image/default.jpg';

        if (isNaN(price) || price < 5 || price > 250000) {
            alert('Please enter a price between 5 and 250,000.');
            return;
        }

        if (isEditPage && bookIndex !== null) {
            await fetch(`/api/books/${bookIndex}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title, description, price, img: imagePath })
            });
        } else {
            await fetch('/api/books', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title, description, price, img: imagePath })
            });
        }

        window.location.href = 'index.html';
    });

    fillForm();
});
