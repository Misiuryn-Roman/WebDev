document.addEventListener('DOMContentLoaded', () => {
    const itemsContainer = document.getElementById('items_container');
    const searchButton = document.getElementById('search_button');
    const clearButton = document.getElementById('clear_button');
    const searchInput = document.getElementById('find_item');
    const sortCheckboxInput = document.getElementById('sort_checkbox_input');
    const countButton = document.getElementById('count_button');
    const countClearButton = document.getElementById('count_clear_button');
    const sumPriceElement = document.getElementById('sumprice');

    // Array of animals (title, description, price, and image)
    const animalData = [
        { title: 'The Dark Tower I: The Gunslinger', description: 'Some description here.', price: 15, img: 'image/tdt1.jpg' },
        { title: 'The Dark Tower II: The Drawing of the Three', description: 'Some description here.', price: 15, img: 'image/tdt2.jpg' },
        { title: 'The Dark Tower III: The Waste Lands', description: 'Some description here.', price: 15, img: 'image/tdt3.jpg' },
        { title: 'The Outsider', description: 'Some description here.', price: 20, img: 'image/outsider.jpeg' },
        { title: 'Dreamcatcher', description: 'Some description here.', price: 25, img: 'image/dream.jpg' },
        { title: 'The Shining', description: 'Some description here.', price: 20, img: 'image/shine.jpg' },
        { title: 'Doctor Sleep', description: 'Some description here.', price: 30, img: 'image/dcsleep.jpg' }
    ];

    // Dynamically generate animal cards
    animalData.forEach((animal, index) => {
        const li = document.createElement('li');
        li.classList.add('cards__content');
        li.id = `card${index + 1}`;
        
        li.innerHTML = `
            <img src="${animal.img}" alt="${animal.title}" class="cards__img">
            <div class="cards__body">
                <h2 class="cards__title">${animal.title}</h2>
                <p class="cards__parag">${animal.description}</p>
                <p class="cards__price">Price: ${animal.price} $</p>
            </div>
        `;
        itemsContainer.appendChild(li);
    });

    let items = Array.from(itemsContainer.getElementsByClassName('cards__content'));

    // Search Functionality (without calculating price)
    searchButton.addEventListener('click', () => {
        const query = searchInput.value.toLowerCase();
        items.forEach(item => {
            const title = item.querySelector('.cards__title').innerText.toLowerCase();
            if (title.includes(query)) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        });
    });

    // Clear Search and reset total price to 0
    clearButton.addEventListener('click', () => {
        searchInput.value = '';
        items.forEach(item => {
            item.style.display = 'block';
        });
        sumPriceElement.innerText = '0'; // Reset total price
    });

    // Sort Functionality
    sortCheckboxInput.addEventListener('change', () => {
        const sortedItems = items.sort((a, b) => {
            const priceA = parseInt(a.querySelector('.cards__price').innerText.replace(/\D/g, ''));
            const priceB = parseInt(b.querySelector('.cards__price').innerText.replace(/\D/g, ''));
            return sortCheckboxInput.checked ? priceB - priceA : priceA - priceB;
        });
        sortedItems.forEach(item => itemsContainer.appendChild(item));
    });

    // Count Total Price of only displayed items when Count button is clicked
    countButton.addEventListener('click', () => {
        let totalPrice = 0;
        items.forEach(item => {
            if (item.style.display !== 'none') {
                const price = parseInt(item.querySelector('.cards__price').innerText.replace(/\D/g, ''));
                totalPrice += price;
            }
        });
        sumPriceElement.innerText = totalPrice;
    });

    // Clear Total Price
    countClearButton.addEventListener('click', () => {
        sumPriceElement.innerText = '0';
    });
});
