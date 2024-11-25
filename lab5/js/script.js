document.addEventListener('DOMContentLoaded', () => {
    const itemsContainer = document.getElementById('items_container');
    const searchButton = document.getElementById('search_button');
    const clearButton = document.getElementById('clear_button');
    const searchInput = document.getElementById('find_item');
    const sortCheckboxInput = document.getElementById('sort_checkbox_input');
    const countButton = document.getElementById('count_button');
    const countClearButton = document.getElementById('count_clear_button');
    const sumPriceElement = document.getElementById('sumprice');

    // Fetch and display books (with optional sorting)
    function loadBooks(sortByPrice = '') {
        const url = `/api/books${sortByPrice ? `?sortByPrice=${sortByPrice}` : ''}`;
        fetch(url)
            .then(response => response.json())
            .then(books => {
                itemsContainer.innerHTML = '';
                if (books.length === 0) {
                    itemsContainer.innerHTML = '<p>No books available. Please add some!</p>';
                } else {
                    books.forEach((book, index) => {
                        const li = document.createElement('li');
                        li.classList.add('cards__content');
                        li.id = `card${index}`;

                        li.innerHTML = `
                            <img src="${book.img}" alt="${book.title}" class="cards__img" onerror="this.onerror=null; this.src='image/default.jpg'">
                            <div class="cards__body">
                                <h2 class="cards__title">${book.title}</h2>
                                <p class="cards__parag">${book.description}</p>
                                <p class="cards__price">Price: ${book.price} $</p>
                                <button class="cards__edit" onclick="editBook(${index})">Edit</button>
                                <button class="cards__remove" onclick="removeBook(${index})">Remove</button>
                            </div>
                        `;
                        itemsContainer.appendChild(li);
                    });
                }
            });
    }

    // Initial load (no sorting)
    loadBooks();

    // Sorting when the checkbox is toggled
    sortCheckboxInput.addEventListener('change', () => {
        const sortByPrice = sortCheckboxInput.checked ? 'desc' : 'asc';
        loadBooks(sortByPrice);
    });

    // Search functionality
    searchButton.addEventListener('click', () => {
        const query = searchInput.value.toLowerCase();
        const items = Array.from(itemsContainer.getElementsByClassName('cards__content'));
        items.forEach(item => {
            const title = item.querySelector('.cards__title').innerText.toLowerCase();
            if (title.includes(query)) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        });
    });

    // Clear search
    clearButton.addEventListener('click', () => {
        searchInput.value = '';
        loadBooks();
        sumPriceElement.innerText = '0';
    });

    // Count total price
    countButton.addEventListener('click', () => {
        let totalPrice = 0;
        const items = Array.from(itemsContainer.getElementsByClassName('cards__content'));
        items.forEach(item => {
            if (item.style.display !== 'none') {
                const price = parseInt(item.querySelector('.cards__price').innerText.replace(/\D/g, ''));
                totalPrice += price;
            }
        });
        sumPriceElement.innerText = totalPrice;
    });

    // Clear total price
    countClearButton.addEventListener('click', () => {
        sumPriceElement.innerText = '0';
    });

    // Edit book functionality (redirection)
    window.editBook = function(index) {
        window.location.href = `edit.html?index=${index}`;
    };

    // Remove book functionality
    window.removeBook = function(index) {
        fetch(`/api/books/${index}`, { method: 'DELETE' })
            .then(() => {
                loadBooks();
            });
    };
});
