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

const setAddToCartFunction = (btn, pid, qty) => {
    btn.addEventListener('click', () => {
        const quantity = Number(qty.innerHTML);
        const newProduct = {
            product: pid,
            quantity
        }
        console.log(newProduct);

        socketClient.emit('addToCart', newProduct);

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

socketClient.on('addedProductToCart', msg => alert(msg));