document.addEventListener('DOMContentLoaded', function () {

    // Find the 'products' container
    let products = document.querySelector('.products');
    // Create an empty cart object to store cart items
    let cart = {};
    // Find the cart dropdown menu
    let cartDropdown = document.getElementById('cart-dropdown');
    // Find the cart icon
    let cartIcon = document.querySelector('.cart');
    // Find the cart count element (shows the number of items in the cart)
    let cartCount = document.getElementById('count');



    //show or hide the cart dropdown menu when the cart icon is clicked
    cartIcon.addEventListener('click', () => {
        cartDropdown.classList.toggle('active');
        updateCartDropdown();
    });



    // Fetching products from the API
    async function fetchProducts(url) {

        //getting data from the API
        let data = await fetch(url);
        //converting the data to json format
        let response = await data.json();

    // For each product, create a product card and add it to the products containers
        response.forEach(product => {
            let description = product.description;
            let product_title = product.title;
            products.innerHTML += `
                <div class="product">
                    <img src="${product.image}" alt="" class="product-img">
                    <div class="product-content">
                        <h2 class="product-title">${product_title.length > 15 ? product_title.substring(0, 18).concat('...') : product_title}</h2>
                        <h4 class="product-category">${product.category}</h4>
                        <p class="product-description">${description.length > 20 ? description.substring(0, 80).concat('... more') : description}</p>
                        <div class="product-price-container">
                            <h3 class="product-price">$${product.price}</h3>
                            <a href="#!" data-productID="${product.id}" data-producttitle="${product.title}" data-productprice="${product.price}" class="add-to-cart">Add to Cart</a>
                        </div>
                    </div>
                </div>
            `;
        });

        // Find all "Add to Cart" buttons and attach click event listeners to them
        let addToCartButtons = document.querySelectorAll('.add-to-cart');
        addToCartButtons.forEach(button => {
            button.addEventListener('click', addToCart);
        });
    }

    // Function to add a product to the cart
    function addToCart(event) {

        // Get the product ID, title, and price from the clicked button
        let productId = event.target.dataset.productid;
        let productTitle = event.target.dataset.producttitle;
        let productPrice = event.target.dataset.productprice;


        // If the product is already in the cart, increase the quantity by 1
        if (cart[productId]) {
            cart[productId].quantity += 1;
        }
        // Otherwise, add the product to the cart with a quantity of 1
        else {
            cart[productId] = {
                title: productTitle,
                price: parseFloat(productPrice),
                quantity: 1
            };
        }
        updateCartCount();
        updateCartDropdown();
    }

    // Function to update the cart count in the cart icon
    function updateCartCount() {
        // Calculate the total number of items in the cart
        let totalItems = Object.values(cart).reduce((sum, product) => sum + product.quantity, 0);
        
        // Update the cart count in the cart icon
        cartCount.textContent = totalItems;
    }


    // Function to update the cart dropdown menu
    function updateCartDropdown() {

        // Clear the cart dropdown menu
        cartDropdown.innerHTML = '';

        // If the cart is empty, display a message
        if (Object.keys(cart).length === 0) {
            cartDropdown.innerHTML = '<p>Your cart is empty</p>';
        } 
        // Otherwise, display the cart items and the total price
        else {
            let totalPrice = 0;

            
            // For each product in the cart, display the product title, quantity, and total price
            for (let productId in cart) {

                // Calculate the total price for each product
                let cartItem = cart[productId];
                totalPrice += cartItem.price * cartItem.quantity;
                
                // Display the product title, quantity
                cartDropdown.innerHTML += `
                    <div class="cart-item">
                        <h4>${cartItem.title}</h4>
                        <div class="quantity-control">
                            <button class="decrease-quantity" data-productid="${productId}">-</button>
                            <input type="text" value="${cartItem.quantity}" readonly>
                            <button class="increase-quantity" data-productid="${productId}">+</button>
                        </div>
                        <div class="item-price"><b>Price:</b><br>${cartItem.price}$</div>
                    </div>
                `;
            }


            // Display the total price
            cartDropdown.innerHTML += `
                <div class="total-price">
                    Total: $${totalPrice.toFixed(2)}
                </div>
            `;


            // Find all "Decrease" and "Increase" buttons in the cart dropdown menu and attach click event listeners to them
            let decreaseButtons = cartDropdown.querySelectorAll('.decrease-quantity');
            let increaseButtons = cartDropdown.querySelectorAll('.increase-quantity');

            decreaseButtons.forEach(button => {
                button.addEventListener('click', decreaseQuantity);
            });

            increaseButtons.forEach(button => {
                button.addEventListener('click', increaseQuantity);
            });
        }
    }


    // Function to decrease the quantity of a product in the cart
    function decreaseQuantity(event) {

        // Get the product ID from the clicked button
        let productId = event.target.dataset.productid;
        if (cart[productId].quantity > 1) {
            cart[productId].quantity -= 1;
        } else {
            delete cart[productId];
        }
        updateCartCount();
        updateCartDropdown();
    }


    // Function to increase the quantity of a product in the cart
    function increaseQuantity(event) {
        let productId = event.target.dataset.productid;
        cart[productId].quantity += 1;
        updateCartCount();
        updateCartDropdown();
    }
    fetchProducts('https://fakestoreapi.com/products');
});
