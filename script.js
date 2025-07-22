// Product Data
var productsData = {
    1: { name: 'Fall Limited Edition Sneakers', price: 125 },
    2: { name: 'Spring Limited Edition Sneakers', price: 140 }
};

// Load cart from localStorage
var cartCount = document.getElementById('cart-count');
var cartItems = document.getElementById('cart-items');
var cartData = JSON.parse(localStorage.getItem('cartData')) || [];

function updateCart() {
    cartItems.innerHTML = '';
    var totalItems = 0;

    if (cartData.length === 0) {
        var li = document.createElement('li');
        li.textContent = 'Your cart is empty.';
        cartItems.appendChild(li);
    } else {
        for (var i = 0; i < cartData.length; i++) {
            totalItems += cartData[i].quantity;
            var li = document.createElement('li');
            li.textContent = cartData[i].name + ' - $' + cartData[i].price + ' x ' + cartData[i].quantity;

            var removeBtn = document.createElement('button');
            removeBtn.textContent = 'Remove';
            removeBtn.setAttribute('data-index', i);

            removeBtn.addEventListener('click', function () {
                var index = parseInt(this.getAttribute('data-index'));
                cartData.splice(index, 1);
                saveAndRefresh();
            });

            li.appendChild(removeBtn);
            cartItems.appendChild(li);
        }
    }

    cartCount.textContent = totalItems;
}

function saveAndRefresh() {
    localStorage.setItem('cartData', JSON.stringify(cartData));
    updateCart();
}

updateCart();

// Quantity controls
var quantities = {};
var increaseBtns = document.getElementsByClassName('increase');
var decreaseBtns = document.getElementsByClassName('decrease');

for (var i = 0; i < increaseBtns.length; i++) {
    increaseBtns[i].addEventListener('click', function () {
        var pid = this.getAttribute('data-product');
        if (!quantities[pid]) { quantities[pid] = 0; }
        quantities[pid]++;
        document.querySelector('.quantity[data-product="' + pid + '"]').textContent = quantities[pid];
    });
}

for (var i = 0; i < decreaseBtns.length; i++) {
    decreaseBtns[i].addEventListener('click', function () {
        var pid = this.getAttribute('data-product');
        if (!quantities[pid]) { quantities[pid] = 0; }
        if (quantities[pid] > 0) { quantities[pid]--; }
        document.querySelector('.quantity[data-product="' + pid + '"]').textContent = quantities[pid];
    });
}

// Add to cart
var addBtns = document.getElementsByClassName('add-to-cart');
for (var i = 0; i < addBtns.length; i++) {
    addBtns[i].addEventListener('click', function () {
        var pid = this.getAttribute('data-product');
        var qty = quantities[pid] || 0;

        if (qty > 0) {
            var found = false;
            for (var j = 0; j < cartData.length; j++) {
                if (cartData[j].name === productsData[pid].name) {
                    cartData[j].quantity += qty;
                    found = true;
                    break;
                }
            }
            if (!found) {
                cartData.push({
                    name: productsData[pid].name,
                    price: productsData[pid].price,
                    quantity: qty
                });
            }
            saveAndRefresh();
            quantities[pid] = 0;
            document.querySelector('.quantity[data-product="' + pid + '"]').textContent = 0;
        } else {
            alert('Please select quantity before adding to cart.');
        }
    });
}

// Thumbnail switching
var thumbs = document.getElementsByClassName('thumbnail');
for (var i = 0; i < thumbs.length; i++) {
    thumbs[i].addEventListener('click', function () {
        var mainImg = this.parentNode.previousElementSibling;
        mainImg.src = this.src;
    });
}

// Navbar filtering
var navLinks = document.querySelectorAll('nav ul li a');
var productBlocks = document.querySelectorAll('.product-block');

function showProducts(category) {
    for (var i = 0; i < productBlocks.length; i++) {
        var cat = productBlocks[i].getAttribute('data-category');
        if (category === 'all' || cat === category) {
            productBlocks[i].style.display = 'flex';
        } else {
            productBlocks[i].style.display = 'none';
        }
    }
}

for (var i = 0; i < navLinks.length; i++) {
    navLinks[i].addEventListener('click', function (e) {
        e.preventDefault();
        var text = this.textContent.toLowerCase();
        if (text === 'collections') {
            showProducts('all');
        } else if (text === 'men') {
            showProducts('men');
        } else if (text === 'women') {
            showProducts('women');
        } else {
            alert('This section is under development.');
        }
    });
}
// Initial display of all products
showProducts('all');    