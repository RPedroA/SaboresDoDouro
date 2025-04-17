document.addEventListener('DOMContentLoaded', function () {
    const forms = document.querySelectorAll('.needs-validation');

    forms.forEach(form => {
        form.addEventListener('submit', function (event) {
            if (!form.checkValidity()) {
                event.preventDefault();
                event.stopPropagation();
            }
            form.classList.add('was-validated');
        }, false);
    });

    const inputs = document.querySelectorAll('.form-control');
    
    inputs.forEach(input => {
        input.addEventListener('input', function () {
            if (input.checkValidity()) {
                input.classList.remove('is-invalid');
                input.classList.add('is-valid');
            } else {
                input.classList.remove('is-valid');
                input.classList.add('is-invalid');
            }
        });
    });

    const submitButton = document.querySelector('button[type="submit"]');
    const updateSubmitButtonState = () => {
        const allValid = [...inputs].every(input => input.checkValidity());
        submitButton.disabled = !allValid;
    };

    inputs.forEach(input => {
        input.addEventListener('input', updateSubmitButtonState);
    });

    const productName = localStorage.getItem('productName');
    const productPrice = localStorage.getItem('productPrice');
    const productQuantity = localStorage.getItem('productQuantity');
    const totalPrice = localStorage.getItem('totalPrice');

    if (productName && productPrice && productQuantity && totalPrice) {
        const orderSummary = document.querySelector('.order-summary ul');
        
        orderSummary.innerHTML = `
            <li>
                <span>${productName} (${productQuantity} unidade${productQuantity > 1 ? 's' : ''})</span>
                <span>${(productPrice * productQuantity).toFixed(2)} €</span>
            </li>
            <li>
                <span>Entrega</span>
                <span>Grátis</span>
            </li>
            <li>
                <span>Total</span>
                <span>${totalPrice} €</span>
            </li>
        `;
    } else {
        console.error('Detalhes do produto não encontrados no localStorage');
    }
});

document.addEventListener('DOMContentLoaded', function () {
    const form = document.querySelector('#payment-form');

    const nome = localStorage.getItem('productName');
    const preco = localStorage.getItem('productPrice');
    const quantidade = localStorage.getItem('productQuantity');
    const totalPreco = localStorage.getItem('totalPrice');
    
    if (nome && preco && quantidade && totalPreco) {
        console.log(`Produto: ${nome}, Preço: ${preco}, Quantidade: ${quantidade}, Total: ${totalPreco}`);
    }

    form.addEventListener('submit', function (event) {
        event.preventDefault();

        const inputs = form.querySelectorAll('.form-control');
        const isValid = [...inputs].every(input => input.checkValidity());

        if (isValid) {
            alert('A sua encomenda foi realizada com sucesso!');

            localStorage.removeItem('productName');
            localStorage.removeItem('productPrice');
            localStorage.removeItem('productQuantity');
            localStorage.removeItem('totalPrice');

            window.location.href = '../Loja/Loja.html';
        } else {
            alert('Por favor, preencha todos os campos corretamente.');
        }
    });
});
