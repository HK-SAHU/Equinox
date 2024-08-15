let menu = document.querySelector('#menu-bars');
let navbar = document.querySelector('.navbar');

menu.onclick = () => {
    menu.classList.toggle('fa-times');
    navbar.classList.toggle('active');
};

let sections = document.querySelectorAll('section');
let navlinks = document.querySelectorAll('header .navbar a');

window.onscroll = () => {
    menu.classList.remove('fa-times');
    navbar.classList.remove('active');
    sections.forEach(sec => {
        let top = window.scrollY;
        let height = sec.offsetHeight;
        let offset = sec.offsetTop - 150;
        let id = sec.getAttribute('id');

        if (top >= offset && top < offset + height) {
            navlinks.forEach(link => {
                link.classList.remove('active');
            });
            document.querySelector('header .navbar a[href="#' + id + '"]').classList.add('active');
            // Fixed the selector above to match href="#id"  this needs debugging
        }
    });
};

// search icon toggling

document.querySelector('#search-icon').onclick = () => {
    document.querySelector('#search-form').classList.toggle('active');
};

document.querySelector('#close').onclick = () => {
    document.querySelector('#search-form').classList.remove('active');
};

// swiper home page pagination 
var swiper = new Swiper(".home-slider", {
    spaceBetween: 30,
    centeredSlides: true,
    autoplay: {
        delay: 7500,
        disableOnInteraction: false,
    },
    pagination: {
        el: ".swiper-pagination",
        clickable: true,
    },
    loop: true,
});


// shopping cart 

let cartIcon = document.querySelector('.fa-shopping-cart');
let cart = document.querySelector('.cart');
let closeCart = document.querySelector('#close-cart');

// toggling of the shoppin cart icon 
cartIcon.onclick = () => {
    cart.classList.add("active");
    
};

closeCart.onclick = () => {
    cart.classList.remove("active");
    updateTotal();
};

if (document.readyState == "loading") {
    document.addEventListener("DOMContentLoaded", ready);
    updateTotal();
} else {
    ready();
    updateTotal();
}


function ready() {

    var removeCartButtons = document.querySelectorAll(".cart-remove"); 
    for (var i = 0; i < removeCartButtons.length; i++) {
        var button = removeCartButtons[i];
        button.addEventListener("click", removeCartItem);
    }

    var quantityInputs = document.querySelectorAll(".cart-quantity"); 
    for (var i = 0; i < quantityInputs.length; i++) {
        var input = quantityInputs[i];
        input.addEventListener("change", quantityChanged);
    }

    var addCartButtons = document.querySelectorAll(".add-to-cart"); 
    for (var i = 0; i < addCartButtons.length; i++) {
        var button = addCartButtons[i];
        button.addEventListener("click", addCartClicked);
    }

    document.querySelector(".buy-btn").addEventListener("click", buyButton);
    updateTotal();
    
}

function buyButton() {
    alert("Your order is placed");
    var cartContent = document.querySelector(".cart-content"); 
    while (cartContent.hasChildNodes()) {
        cartContent.removeChild(cartContent.firstChild);
    }
    updateTotal();
}

function removeCartItem(event) {
    var buttonClicked = event.target;
    buttonClicked.parentElement.remove();
    updateTotal();
}

function quantityChanged(event) {
    var input = event.target;
    if (isNaN(input.value) || input.value <= 0) {
        input.value = 1;
    }
    updateTotal();
}

function addCartClicked(event) {
    var button = event.target;
    var shopProduct = button.parentElement;
    var title = shopProduct.getElementsByClassName("product-title")[0].innerText;
    var price = shopProduct.getElementsByClassName("proce")[0].innerText;
    var productImage = shopProduct.getElementsByClassName("product-image")[0].src;
    addProductToCart(title, price, productImage);
    updateTotal();
}



function addProductToCart(title, price, productImage) {
    var cartItems = document.getElementsByClassName("cart-content")[0];
    var cartItemsNames = cartItems.getElementsByClassName("cart-product-title");

    // Convert the title to lowercase for case-insensitive comparison
    var lowercaseTitle = title.toLowerCase();

    // Check if the item is already in the cart
    for (var i = 0; i < cartItemsNames.length; i++) {
        var currentItemTitle = cartItemsNames[i].innerText.toLowerCase();

        // Compare the lowercase titles
        if (currentItemTitle === lowercaseTitle) {
            alert("You have already added this item to the cart!");
            return;
        }
    }

    var cartShopBox = document.createElement("div");
    cartShopBox.classList.add("cart-box");
    var cartBoxContent = `
    <img src="${productImage}" alt="" class="cart-image">
    <div class="detail-box">
        <div class="cart-product-title">${title}</div>
        <div class="cart-price">${price}</div>
        <input type="number" value="1" class="cart-quantity">
    </div>
    <i class="fa-solid fa-trash-can cart-remove"></i>
    `;
    cartShopBox.innerHTML = cartBoxContent;
    cartItems.appendChild(cartShopBox);
    cartShopBox.getElementsByClassName("cart-remove")[0].addEventListener("click", removeCartItem);
    cartShopBox.getElementsByClassName("cart-quantity")[0].addEventListener("change", quantityChanged);
    updateTotal();
}





function updateTotal() {
    var cartContent = document.querySelector(".cart-content");
    var cartBoxes = cartContent.querySelectorAll(".cart-box");
    var total = 0.0;

    cartBoxes.forEach(function(cartBox) {
        var priceElement = cartBox.querySelector(".cart-price");
        var quantityElement = cartBox.querySelector(".cart-quantity");

        // Check if priceElement exists and contains text
        if (priceElement && priceElement.innerText.trim() !== "") {
            var priceText = priceElement.innerText;
            if (priceText.includes("₹")) {
                var price = parseFloat(priceText.replace("₹", ""));
                var quantity = parseFloat(quantityElement.value);
                total += price * quantity;
            } else {
                console.error("Price text does not include currency symbol:", priceText);
            }
        } else {
            console.error("Price element is missing or empty");
        }
    });

    document.querySelector(".total-price").innerText = "₹" + total.toFixed(2);
}