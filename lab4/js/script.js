document.addEventListener('DOMContentLoaded', () => {
    const itemsContainer = document.getElementById('items_container');
    const searchButton = document.getElementById('search_button');
    const clearButton = document.getElementById('clear_button');
    const searchInput = document.getElementById('find_item');
    const sortCheckboxInput = document.getElementById('sort_checkbox_input');
    const countButton = document.getElementById('count_button');
    const countClearButton = document.getElementById('count_clear_button');
    const sumPriceElement = document.getElementById('sumprice');

    let books = JSON.parse(localStorage.getItem('books')) || [];

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

    window.editBook = function(index) {
        window.location.href = `edit.html?index=${index}`;
    };

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

    clearButton.addEventListener('click', () => {
        searchInput.value = '';
        const items = Array.from(itemsContainer.getElementsByClassName('cards__content'));
        items.forEach(item => {
            item.style.display = 'block';
        });
        sumPriceElement.innerText = '0';
    });

    sortCheckboxInput.addEventListener('change', () => {
        const items = Array.from(itemsContainer.getElementsByClassName('cards__content'));
        const sortedItems = items.sort((a, b) => {
            const priceA = parseInt(a.querySelector('.cards__price').innerText.replace(/\D/g, ''));
            const priceB = parseInt(b.querySelector('.cards__price').innerText.replace(/\D/g, ''));
            return sortCheckboxInput.checked ? priceB - priceA : priceA - priceB;
        });
        sortedItems.forEach(item => itemsContainer.appendChild(item));
    });

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

    countClearButton.addEventListener('click', () => {
        sumPriceElement.innerText = '0';
    });
});
