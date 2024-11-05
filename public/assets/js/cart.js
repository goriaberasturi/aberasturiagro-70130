const socketClient = io();

const counters = document.querySelectorAll('.ctrlsContainer');
const info = document.querySelectorAll('.infoContainer');

const setCounterFunction = (method, btn, num, pid) => {
    btn.addEventListener('click', async () => {
        let count = Number(num.innerHTML);
        let qty;
        if (method == 'add') {
            qty = { quantity: 1 };
            count++;
            num.innerHTML = count;
        };
        if (method == 'substract') {
            if(count > 1) {
                qty = { quantity: -1 };
                count--;
                num.innerHTML = count;
            } else {
                qty = { quantity: 0 };
            }
        };
        // socketClient.emit('incCartQuanity', pid);

        try {
            const response = await fetch(`/api/carts/products/${pid}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify(qty)
            });

            if (response.ok) {
                const data = await response.json();
            } else {
                alert('Hubo un error al agregar el producto al carrito');
            }

        } catch (error) {
            console.log(error);
            alert('Hubo un error inesperado!');
        }
    });
};

const setDeleteFunction = (btn, pid) => {
    btn.addEventListener('click', async () => {

        try {
            const response = await fetch(`/api/carts/products/${pid}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            });

            if (response.ok) {
                btn.parentElement.parentElement.style.display = 'none';
            } else {
                alert('Hubo un error al agregar el producto al carrito');
            }

        } catch (error) {
            console.log(error);
            alert('Hubo un error inesperado!');
        }
        
    });
}

counters.forEach(ctr => {
    const pid = ctr.getAttribute('id');
    const plus = ctr.querySelector('.plus');
    const num = ctr.querySelector('.num');
    const minus = ctr.querySelector('.minus');
    const deleteBtn = ctr.querySelector('.deleteBtn');

    setCounterFunction('add', plus, num, pid);
    setCounterFunction('substract', minus, num, pid);
    setDeleteFunction(deleteBtn, pid);
});