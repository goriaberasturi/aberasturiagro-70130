const socketClient = io();

// Actualiza el componente que lista los productos
function updateProductList(lista) {
    const prodList = document.querySelector('.prodList');

    let productosHTML = '';

    lista.forEach(prod => {
        productosHTML += `<div id="${prod._id.toString()}" class="productCard">
        <div class="imgContainer">
            <img src="${prod.thumbnails || ''}" alt="${prod.title}">
        </div>
        <h2>${prod.title}</h2>
            <ul>
                <li><span>description:</span> ${prod.description}</li>
                <li><span>price:</span> ${prod.price}</li>
                <li><span>code:</span> ${prod.code}</li>
                <li><span>category:</span> ${prod.category}</li>
                <li><span>stock:</span> ${prod.stock}</li>
                </ul>
                <div class="crudBtnsContainer">
                    <button class="updateBtn">Modificar</button>
                    <button class="deleteBtn">Eliminar</button>
                </div>
        </div>`;
    });

    prodList.innerHTML = productosHTML;
    
    const pCards = document.querySelectorAll('.productCard');
    pCards.forEach(card => {
        const pid = card.getAttribute('id');
        const deleteBtn = card.querySelector('.deleteBtn');
        const updateBtn = card.querySelector('.updateBtn');

        deleteBtn.addEventListener('click', () => {
            if(confirm('Esta seguro que desea eliminar el producto?')) deleteProduct(deleteBtn, pid);
        });

        updateBtn.addEventListener('click', () => {
            window.location.href = `/realTimeProducts/${pid}`
        });
    });
}

// Funcion para eliminar un producot con socket
async function deleteProduct(btn, pid) {
    try {
        const response = await fetch(`/api/products/${pid}`, {
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
}


let form = document.querySelector("#formProduct");
form.addEventListener('submit', async (evt) => {
    evt.preventDefault();

    const newProduct = {
        title: form.elements.title.value,
        description: form.elements.description.value,
        price: form.elements.price.value,
        thumbnails: form.elements.thumbnails.value,
        code: form.elements.code.value,
        category: form.elements.category.value,
        stock: form.elements.stock.value,
        status: form.elements.status.checked,
    }

    try {
        const response = await fetch(`/api/products`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify(newProduct)
        });

        if (response.ok) {
            socketClient.emit('addProduct');
        } else {
            alert('Hubo un error al agregar el producto al carrito');
        }

    } catch (error) {
        console.log(error);
        alert('Hubo un error inesperado!');
    }

    form.reset();
});

// Ejecuta la carga de productos en la lista
socketClient.on('productLoad', listaProd => {
    updateProductList(listaProd);
});