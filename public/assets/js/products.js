const socketClient = io();

const ctrlsContainers = document.querySelectorAll('.ctrlsContainer');

const setAddFunction = (btn, num) => {
    btn.addEventListener('click', () => {
        let count = Number(num.innerHTML);
        count++;
        num.innerHTML = count;
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

            if(response.ok) {
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

ctrlsContainers.forEach(ctr => {
    const id = ctr.getAttribute('id');

    const plus = ctr.querySelector('.plus');
    const num = ctr.querySelector('.num');
    const minus = ctr.querySelector('.minus');
    const addBtns = ctr.querySelector('.addBtn');

    setAddFunction(plus, num);
    setSubstractFunction(minus, num);
    setAddToCartFunction(addBtns, id, num);
});