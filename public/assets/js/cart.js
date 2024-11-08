const updateTotalAmount = () => {
    const totalAmount = document.querySelector('.products-amount');
    let total = 0;

    cartCards.forEach(card => {
        const displayStyle = window.getComputedStyle(card).display;
        if (displayStyle != 'none') {
            const pAmount = Number(card.querySelector('.cartAmount').innerHTML);
            total += pAmount;
        }
    });

    totalAmount.innerHTML = total;
}

const updateAmount = pid => {
    const card = document.getElementById(pid);
    const amountContainer = card.querySelector('.cartAmount');
    const price = Number(card.querySelector('.price-info').textContent.substring(7));
    const quantity = Number(card.querySelector('.num').textContent);

    amountContainer.innerHTML = price * quantity;
};

const setCounterFunction = (method, btn, num, pid, stock) => {
    btn.addEventListener('click', async () => {
        let count = Number(num.innerHTML);
        let qty = null;

        if (method == 'add') {
            if (count < stock) {
                qty = { quantity: 1 };
                count++;
                num.innerHTML = count;
            }
        } else if (method == 'substract') {
            if (count > 1) {
                qty = { quantity: -1 };
                count--;
                num.innerHTML = count;
            }
        };

        if (qty) {
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
                    updateAmount(pid);
                    updateTotalAmount();
                } else {
                    alert('Hubo un error al actualizar el producto en el carrito');
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
                updateTotalAmount();
            } else {
                alert('Hubo un error al elimiar el producto del carrito');
            }

        } catch (error) {
            console.log(error);
            alert('Hubo un error inesperado!');
        }

    });
}


const cartCards = document.querySelectorAll('.productCard');
const confirmBtn = document.querySelector('.purchase-confirm');

document.addEventListener('DOMContentLoaded', e => {
    let checker = 0;
    cartCards.forEach(card => {
        const pid = card.getAttribute('id');
        updateAmount(pid);
        checker++;
    });
    if (checker > 0) updateTotalAmount();
});

if (confirmBtn) {
    confirmBtn.addEventListener('click', async e => {
        e.preventDefault();

        if (confirm('Confirma que quiere realizar la compra?')) {
            try {
                const response = await fetch(`/api/carts/purchase`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    credentials: 'include'
                });

                if (response.ok) {
                    const result = await response.json();
                    const { unprocessed } = result;
                    if(unprocessed.length == 0) {
                        window.location.href = '/products';
                        alert(`Compra realizada con exito. Su codigo de referencia es: \n${result.payload.code || 'Error al generar el codigo'}`);
                    } else {
                        window.location.href = '/products';
                        alert(`Compra realizada parcialmente. Su codigo de referencia es: \n${result.payload.code || 'Error al generar el codigo'} \nNo se procesaron los siguientes productos: \n${unprocessed.join('\n')}`);
                    }
                } else {
                    const result = await response.json();
                    const { unprocessed } = result;
                    alert(`No se pudieron procesar los siguientes productos: \n${unprocessed.join('\n')}`);
                }

            } catch (error) {
                console.log(error);
                alert('Hubo un error inesperado!');
            }
        }
    });

}

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


