const socketClient = io();

function updateProductList(lista) {
    const prodList = document.querySelector('#prodList');

    let productosHTML = '';

    lista.forEach( prod => {
        productosHTML += `<div class="productCard">
        <h2>${prod.title}</h2>
            <ul>
                <li>description: ${prod.description}</li>
                <li>price: ${prod.price}</li>
                <li>code: ${prod.code}</li>
                <li>category: ${prod.category}</li>
                <li>stock: ${prod.stock}</li>
                </ul>
            <button id onclick="deleteProduct(${prod.id})">Eliminar</button>
        </div>`
    });

    prodList.innerHTML = productosHTML;
}

function deleteProduct(id) {
    socketClient.emit('deleteProduct', id);
}

let form = document.querySelector("#formProduct");
form.addEventListener('submit', (evt) => {
    evt.preventDefault();

    let title = form.elements.title.value;
    let description = form.elements.description.value;
    let price = form.elements.price.value;
    let code = form.elements.code.value;
    let category = form.elements.category.value;
    let stock = form.elements.stock.value;
    let status = form.elements.status.checked;

    socketClient.emit('addProduct', {
        title,
        description,
        price,
        code,
        category,
        stock,
        status
    });

    form.reset();
});

let idInput = document.querySelector('#id-prod');
let deleteBtn = document.querySelector('#delete-btn');
// deleteBtn.onclick = () => {
//     socketClient.emit('deleteProduct', idInput.value);
//     idInput.value = '';
// };

socketClient.on('productLoad', listaProd => {
    updateProductList(listaProd);
});