const grid = document.getElementById('product-grid');
const loading = document.getElementById('loading');
const categorySelect = document.getElementById('category-filter');

let allProducts = [];

// --------  API Integration -----------
fetch('https://fakestoreapi.com/products/')
    .then(res => {
        if (!res.ok) throw new Error();
        return res.json();
    })
    .then(data => {
        allProducts = data;
        setupCategories(data);
        displayProducts(data);
        loading.style.display = 'none';
    })
    .catch(() => {
        loading.innerHTML = "<h2>Failed to load data</h2>";
    });

// ------------- Dynamic UI Rendering -------------
function displayProducts(products) {
    grid.innerHTML = '';
    
    products.forEach(item => {
        const title = item.title.length > 50 ? item.title.substring(0, 47) + '...' : item.title;
        const desc = item.description.length > 60 ? item.description.substring(0, 57) + '...' : item.description;

        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <img src="${item.image}" alt="product">
            <h3>${title}</h3>
            <span class="price">$${item.price}</span>
            <p>${desc}</p>
            <div class="btn-container">
                <button class="view-more" onclick="showModal(${item.id})">View More</button>
                <button class="add-cart" onclick="addToCart(${item.id})">Add to Cart</button>
            </div>
    `;
        grid.appendChild(card);
    });
}

// ----------- Search ----------
document.getElementById('search-input').addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase();
    const filtered = allProducts.filter(p => p.title.toLowerCase().includes(term));
    displayProducts(filtered);
});

// ----------------- Category Filter  ----------------
function setupCategories(data) {
    const categories = [...new Set(data.map(p => p.category))];
    categories.forEach(cat => {
        const option = document.createElement('option');
        option.value = cat;
        option.textContent = cat;
        categorySelect.appendChild(option);
    });
}

categorySelect.addEventListener('change', (e) => {
    const cat = e.target.value;
    const filtered = cat === 'all' ? allProducts : allProducts.filter(p => p.category === cat);
    displayProducts(filtered);
});

// ------------------- Sort-------------------
document.getElementById('sort-filter').addEventListener('change', (e) => {
    let sorted = [...allProducts];
    if (e.target.value === 'low') sorted.sort((a, b) => a.price - b.price);
    if (e.target.value === 'high') sorted.sort((a, b) => b.price - a.price);
    displayProducts(sorted);
});

// ---------------  add to cart ---------
function showModal(id) {
    const product = allProducts.find(p => p.id === id);
    alert(`Full Description: ${product.description}`);
}

function addToCart(id) {
    const product = allProducts.find(p => p.id === id);
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.push(product);
    localStorage.setItem('cart', JSON.stringify(cart));
    alert('Product added to localStorage cart!');
}







