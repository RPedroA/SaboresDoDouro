document.addEventListener('DOMContentLoaded', function () {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    
    if (productId) {
        fetchProductDetails(productId);
    } else {
        console.error('No product ID found in URL');
    }

    function fetchProductDetails(id) {
        fetch(`https://backend-vinho.vercel.app/wine/${id}`)
            .then((response) => {
                if (!response.ok) throw new Error('Failed to fetch product details');
                return response.json();
            })
            .then((product) => {
                renderProductDetails(product);
            })
            .catch((error) => console.error('Error fetching product details:', error));
    }

    function renderProductDetails(product) {
        document.querySelector('#product-title').textContent = product.nome;
        document.querySelector('#product-price').textContent = `${product.preco.toFixed(2)} €`;
        document.querySelector('#product-image').src = `https://backend-vinho.vercel.app/images/${product.imagem}`;
        document.querySelector('#product-description').textContent = product.descricao;

        const buyButton = document.querySelector('#buy-now');
        const quantityInput = document.querySelector('#product-quantity');

        buyButton.addEventListener('click', function () {
            const quantity = parseInt(quantityInput.value);
            const totalPrice = (product.preco * quantity).toFixed(2);

            localStorage.setItem('productName', product.nome);
            localStorage.setItem('productPrice', product.preco.toFixed(2));
            localStorage.setItem('productQuantity', quantity);
            localStorage.setItem('totalPrice', totalPrice);

            window.location.href = '../Checkout/Checkout.html';
        });
    }
});
