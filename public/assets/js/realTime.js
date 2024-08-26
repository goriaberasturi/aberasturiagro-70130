const socketClient = io();

// Actualiza el componente que lista los productos
function updateProductList(lista) {
    const prodList = document.querySelector('.prodList');

    let productosHTML = '';

    lista.forEach(prod => {
        productosHTML += `<div class="productCard">
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
            <button id="${prod._id.toString()}" class="deleteBtn">Eliminar</button>
        </div>`;
    });

    prodList.innerHTML = productosHTML;
    
    const deleteBtns = document.querySelectorAll('.deleteBtn');    
    deleteBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            deleteProduct(btn.getAttribute('id'));
        });
    });
}

// Funcion para eliminar un producot con socket
function deleteProduct(id) {
    socketClient.emit('deleteProduct', id);
}


let form = document.querySelector("#formProduct");
form.addEventListener('submit', (evt) => {
    evt.preventDefault();

    let title = form.elements.title.value;
    let description = form.elements.description.value;
    let price = form.elements.price.value;
    let thumbnails = form.elements.imgUrl.value;
    let code = form.elements.code.value;
    let category = form.elements.category.value;
    let stock = form.elements.stock.value;
    let status = form.elements.status.checked;

    socketClient.emit('addProduct', {
        title,
        description,
        price,
        thumbnails,
        code,
        category,
        stock,
        status
    });

    form.reset();
});

// Ejecuta la carga de productos en la lista
socketClient.on('productLoad', listaProd => {
    updateProductList(listaProd);
});