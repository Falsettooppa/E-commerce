/* ====== Olegit Sneaker Shop Script ====== */
/* This script powers the cart, quantity controls,
   section navigation, and image gallery for the shop */

/* ========== Product Data ========== */
var productsData = {
    1: { name: 'Fall Limited Edition Sneakers', price: 125 },
    2: { name: 'Spring Limited Edition Sneakers', price: 140 }
};

/* ========== Get DOM Elements ========== */
var cartCount = document.getElementById('cart-count');
var cartItems = document.getElementById('cart-items');
var productBlocks = document.querySelectorAll('.product-block');
var navLinks = document.querySelectorAll('nav ul li a');
var aboutSection = document.getElementById('about-section');
var contactSection = document.getElementById('contact-section');
var cartSection = document.getElementById('cart');

/* ========== Load Cart Data from Local Storage ========== */
var cartData = JSON.parse(localStorage.getItem('cartData')) || [];
updateCartDisplay();

/* ========== Quantity Controls ========== */
var quantities = {}; // stores quantity of each product
var increaseBtns = document.getElementsByClassName('increase');
var decreaseBtns = document.getElementsByClassName('decrease');
var addBtns = document.getElementsByClassName('add-to-cart');

/* Updates the quantity number showing on screen */
function updateQuantityDisplay(pid) {
    document.querySelector('.quantity[data-product="' + pid + '"]').textContent = quantities[pid] || 0;
}

/* Handle Increase Quantity Button */
for (var i = 0; i < increaseBtns.length; i++) {
    increaseBtns[i].addEventListener('click', function () {
        var pid = this.getAttribute('data-product');
        if (!quantities[pid]) quantities[pid] = 0;
        quantities[pid]++;
        updateQuantityDisplay(pid);
    });
}

/* Handle Decrease Quantity Button */
for (var i = 0; i < decreaseBtns.length; i++) {
    decreaseBtns[i].addEventListener('click', function () {
        var pid = this.getAttribute('data-product');
        if (!quantities[pid]) quantities[pid] = 0;
        if (quantities[pid] > 0) quantities[pid]--;
        updateQuantityDisplay(pid);
    });
}

/* Handle Add to Cart Button */
for (var i = 0; i < addBtns.length; i++) {
    addBtns[i].addEventListener('click', function () {
        var pid = this.getAttribute('data-product');
        var qty = quantities[pid] || 0;

        if (qty > 0) {
            var found = false;
            /* Check if product already in cart, if so update quantity */
            for (var j = 0; j < cartData.length; j++) {
                if (cartData[j].name === productsData[pid].name) {
                    cartData[j].quantity += qty;
                    found = true;
                    break;
                }
            }
            /* If product not in cart, add it */
            if (!found) {
                cartData.push({
                    name: productsData[pid].name,
                    price: productsData[pid].price,
                    quantity: qty
                });
            }
            quantities[pid] = 0; // reset quantity after adding
            updateQuantityDisplay(pid);
            saveCart(); // save updated cart
            updateCartDisplay(); // update UI
        } else {
            alert('Please select quantity before adding to cart.');
        }
    });
}

/* ========== Update Cart Display ========== */
function updateCartDisplay() {
    cartItems.innerHTML = ''; // clear current cart list
    var totalItems = 0;

    if (cartData.length === 0) {
        var li = document.createElement('li');
        li.textContent = 'Your cart is empty.';
        cartItems.appendChild(li);
    } else {
        for (var i = 0; i < cartData.length; i++) {
            totalItems += cartData[i].quantity;
            var li = document.createElement('li');
            li.textContent = cartData[i].name + ' - $' + cartData[i].price + ' x ' + cartData[i].quantity + ' ';

            /* Create remove button for each cart item */
            var removeBtn = document.createElement('button');
            removeBtn.textContent = 'Remove';
            removeBtn.setAttribute('data-index', i);
            removeBtn.addEventListener('click', function () {
                var idx = parseInt(this.getAttribute('data-index'));
                cartData.splice(idx, 1); // remove item from cart
                saveCart();
                updateCartDisplay();
            });

            li.appendChild(removeBtn);
            cartItems.appendChild(li);
        }
    }
    cartCount.textContent = totalItems; // update cart counter icon
}

/* Save cart data to local storage */
function saveCart() {
    localStorage.setItem('cartData', JSON.stringify(cartData));
}

/* ========== Image Gallery Thumbnails ========== */
/* Clicking on a thumbnail changes the main image */
var thumbs = document.getElementsByClassName('thumbnail');
for (var i = 0; i < thumbs.length; i++) {
    thumbs[i].addEventListener('click', function () {
        var mainImg = this.parentNode.previousElementSibling;
        mainImg.src = this.src;
    });
}

/* ========== Section Navigation ========== */

/* Hides all sections before showing the needed one */
function hideAllSections() {
    for (var i = 0; i < productBlocks.length; i++) {
        productBlocks[i].style.display = 'none';
    }
    aboutSection.style.display = 'none';
    contactSection.style.display = 'none';
    cartSection.style.display = 'none';
}

/* Shows a specific section based on the nav clicked */
function showSection(section) {
    hideAllSections();

    if (section === 'collections') {
        for (var i = 0; i < productBlocks.length; i++) {
            productBlocks[i].style.display = 'flex';
        }
        cartSection.style.display = 'block';
    } else if (section === 'men' || section === 'women') {
        for (var i = 0; i < productBlocks.length; i++) {
            var cat = productBlocks[i].getAttribute('data-category');
            productBlocks[i].style.display = (cat === section) ? 'flex' : 'none';
        }
        cartSection.style.display = 'block';
    } else if (section === 'about') {
        aboutSection.style.display = 'block';
    } else if (section === 'contact') {
        contactSection.style.display = 'block';
    }
}

/* Clears active link styling from nav */
function clearActiveLinks() {
    for (var i = 0; i < navLinks.length; i++) {
        navLinks[i].classList.remove('active-link');
    }
}

/* Handle nav link clicks to switch sections */
for (var i = 0; i < navLinks.length; i++) {
    navLinks[i].addEventListener('click', function (e) {
        e.preventDefault();
        var section = this.textContent.toLowerCase(); // get section name from link
        clearActiveLinks();
        this.classList.add('active-link'); // highlight active link
        showSection(section); // show the section
    });
}

/* Default view when page loads */
showSection('collections');
