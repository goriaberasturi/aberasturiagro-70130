const socketClient = io();

const setCounterFunction = (method, btn, num, pid, stock) => {
    btn.addEventListener('click', async () => {
        let count = Number(num.innerHTML);
        let qty = null;

        if (method == 'add') {
            if(count < stock) {
                qty = { quantity: 1 };
                count++;
                num.innerHTML = count;
            }
        } else if (method == 'substract') {
            if(count > 1) {
                qty = { quantity: -1 };
                count--;
                num.innerHTML = count;
            }
        };
        // socketClient.emit('incCartQuanity', pid);

        if(qty) {
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

const cartCards = document.querySelectorAll('.productCard');
cartCards.forEach(card => {
    const pid = card.getAttribute('id');
    const counter = card.querySelector('.ctrlsContainer');
    const liStock = card.querySelector('.stock-info').textContent.substring(7);
    const stock = Number(liStock);

    const plus = counter.querySelector('.plus');
    const num = counter.querySelector('.num');
    const minus = counter.querySelector('.minus');
    const deleteBtn = counter.querySelector('.deleteBtn');
    
    setCounterFunction('add', plus, num, pid, stock);
    setCounterFunction('substract', minus, num, pid, stock);
    setDeleteFunction(deleteBtn, pid);
});


