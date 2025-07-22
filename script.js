
var productsData = {
    1: { name: 'Fall Limited Edition Sneakers', price: 125 },
    2: { name: 'Spring Limited Edition Sneakers', price: 140 }
};


var cartCount = document.getElementById('cart-count');
var cartItems = document.getElementById('cart-items');
var productBlocks = document.querySelectorAll('.product-block');
var navLinks = document.querySelectorAll('nav ul li a');
var aboutSection = document.getElementById('about-section');
var contactSection = document.getElementById('contact-section');
var cartSection = document.getElementById('cart');


var cartData = JSON.parse(localStorage.getItem('cartData')) || [];
updateCartDisplay();


var quantities = {};
var increaseBtns = document.getElementsByClassName('increase');
var decreaseBtns = document.getElementsByClassName('decrease');
var addBtns = document.getElementsByClassName('add-to-cart');

function updateQuantityDisplay(pid) {
    document.querySelector('.quantity[data-product="' + pid + '"]').textContent = quantities[pid] || 0;
}


for (var i = 0; i < increaseBtns.length; i++) {
    increaseBtns[i].addEventListener('click', function () {
        var pid = this.getAttribute('data-product');
        if (!quantities[pid]) quantities[pid] = 0;
        quantities[pid]++;
        updateQuantityDisplay(pid);
    });
}
for (var i = 0; i < decreaseBtns.length; i++) {
    decreaseBtns[i].addEventListener('click', function () {
        var pid = this.getAttribute('data-product');
        if (!quantities[pid]) quantities[pid] = 0;
        if (quantities[pid] > 0) quantities[pid]--;
        updateQuantityDisplay(pid);
    });
}


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
            quantities[pid] = 0;
            updateQuantityDisplay(pid);
            saveCart();
            updateCartDisplay();
        } else {
            alert('Please select quantity before adding to cart.');
        }
    });
}


function updateCartDisplay() {
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
            li.textContent = cartData[i].name + ' - $' + cartData[i].price + ' x ' + cartData[i].quantity + ' ';

            var removeBtn = document.createElement('button');
            removeBtn.textContent = 'Remove';
            removeBtn.setAttribute('data-index', i);
            removeBtn.addEventListener('click', function () {
                var idx = parseInt(this.getAttribute('data-index'));
                cartData.splice(idx, 1);
                saveCart();
                updateCartDisplay();
            });

            li.appendChild(removeBtn);
            cartItems.appendChild(li);
        }
    }
    cartCount.textContent = totalItems;
}

function saveCart() {
    localStorage.setItem('cartData', JSON.stringify(cartData));
}


var thumbs = document.getElementsByClassName('thumbnail');
for (var i = 0; i < thumbs.length; i++) {
    thumbs[i].addEventListener('click', function () {
        var mainImg = this.parentNode.previousElementSibling;
        mainImg.src = this.src;
    });
}


function hideAllSections() {
    var i;
    for (i = 0; i < productBlocks.length; i++) {
        productBlocks[i].style.display = 'none';
    }
    aboutSection.style.display = 'none';
    contactSection.style.display = 'none';
    cartSection.style.display = 'none';
}

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


function clearActiveLinks() {
    for (var i = 0; i < navLinks.length; i++) {
        navLinks[i].classList.remove('active-link');
    }
}


for (var i = 0; i < navLinks.length; i++) {
    navLinks[i].addEventListener('click', function (e) {
        e.preventDefault();
        var section = this.textContent.toLowerCase();
        clearActiveLinks();
        this.classList.add('active-link');
        showSection(section);
    });
}


showSection('collections');
