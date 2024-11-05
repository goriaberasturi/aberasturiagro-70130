const form = document.querySelector("#formProduct");
const updateBtn = document.querySelector('.form-btn');
const pid = updateBtn.getAttribute('id');

form.addEventListener('submit', async e => {
    e.preventDefault();

    const updatedProduct = {
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
        const response = await fetch(`/api/products/${pid}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify(updatedProduct)
        });

        if (response.ok) {
            window.location.href = '/realTimeProducts'
        } else {
            alert('Hubo un error al agregar el producto al carrito');
        }

    } catch (error) {
        console.log(error);
        alert('Hubo un error inesperado!');
    }
});