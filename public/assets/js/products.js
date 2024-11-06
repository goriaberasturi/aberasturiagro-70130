const socketClient = io();

const setAddFunction = (btn, num, stock) => {
    btn.addEventListener('click', () => {
        let count = Number(num.innerHTML);

        if(count < stock) {
            count++;
            num.innerHTML = count;
        };
    });
};

const setSubstractFunction = (btn, num) => {
    btn.addEventListener('click', () => {
        let count = Number(num.innerHTML);

        if (count > 1) {
            count--;
            num.innerHTML = count;
        };
    });
};

const setAddToCartFunction = async (btn, pid, qty) => {
    btn.addEventListener('click', async () => {
        const quantity = Number(qty.innerHTML);
        const newProduct = {
            product: pid,
            quantity
        }

        try {
            const response = await fetch('/api/carts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify(newProduct)
            });

            if (response.ok) {
                alert(`Se agregaron ${newProduct.quantity} unidades!`);
            } else {
                alert('Hubo un error al agregar el producto al carrito');
            }

        } catch (error) {
            console.log(error);
            alert('Hubo un error inesperado!');
        }

        // socketClient.emit('addToCart', newProduct);


        qty.innerHTML = 1;
    });
}

const productCards = document.querySelectorAll('.productCard');
productCards.forEach(card => {
    const id = card.getAttribute('id');
    const ctrlsContainer = card.querySelector('.ctrlsContainer');
    const liStock = card.querySelector('.stock-info').textContent.substring(7);
    const stock = Number(liStock);

    const plus = ctrlsContainer.querySelector('.plus');
    const num = ctrlsContainer.querySelector('.num');
    const minus = ctrlsContainer.querySelector('.minus');
    const addBtns = ctrlsContainer.querySelector('.addBtn');

    setAddFunction(plus, num, stock);
    setSubstractFunction(minus, num);
    setAddToCartFunction(addBtns, id, num);
});
