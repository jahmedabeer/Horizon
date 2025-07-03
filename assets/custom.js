// Fetches the coolers collection and returns its products as JSON
async function fetchCoolers() {
    try {
        const collectionUrl = `${window.location.origin}/collections/coolers`;
        const checkResponse = await fetch(collectionUrl);
        
        if (!checkResponse.ok) return null;
        
        const dataResponse = await fetch(`${collectionUrl}?view=json`);
        return await dataResponse.json();
    } catch (error) {
        console.error('Error checking collection:', error);
        return null;
    }
}

// Event listener: runs when a product is added to the cart via AJAX
document.addEventListener('product-ajax:added', function (event) {
    // Get handles for the added product and the discount product
    const addedProduct = event.detail;
    const productHandle = addedProduct.product.handle
    const discountProductHandle = 'give-away-drink-bottle-choose-your-colour';

    // Fetch the coolers collection and check if the added product is in it
    fetchCoolers().then(async data => {
        const products = data.products;
        const isInCollection = products.some( product => product.handle === productHandle );
        
        // Fetches the current cart
        if (isInCollection) {
            const response = await fetch(`${window.location.origin}/cart.js`);
            const cart = await response.json();
            console.log('Cart items before discountedItem added:', cart.items);
            const isDiscountedItemInCart = cart.items.some(item => item.handle === discountProductHandle);
            console.log('Is DiscountedItemInCart in cart:', isDiscountedItemInCart);
            
            // If the discount product is not in the cart, add it
            if (!isDiscountedItemInCart) {

                return fetch(window.Shopify.routes.root + 'cart/add.js', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        items: [{
                            id: 46262619963631,
                            quantity: 1
                        }]
                    })
                })
                    .then(addedItem => {
                        // Card drawer: refresh the cart UI
                        document.dispatchEvent(new CustomEvent('cart:refresh', {
                            bubbles: true,
                            detail: { open: true }
                        }));
                        console.log('Cart refresh event dispatched');
                    });
            }
        }
    });
})