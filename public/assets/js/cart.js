const socketClient = io();

const counters = document.querySelectorAll('.ctrlsContainer');

const setAddFunction = (btn, num, pid) => {
    btn.addEventListener('click', () => {
        let count = Number(num.innerHTML);
        count++;
        num.innerHTML = count;
        socketClient.emit('incCartQuanity', pid);
    });
};

const setSubstractFunction = (btn, num, pid) => {
    btn.addEventListener('click', () => {
        let count = Number(num.textContent);

        if (count > 1) {
            count--;
            num.innerHTML = count;
            socketClient.emit('decCartQuanity', pid);
        }
    });
};

const setDeleteFunction = (btn, pid) => {
    btn.addEventListener('click', () => {

        socketClient.emit('deleteFromCart', pid);
        btn.parentElement.parentElement.style.display = 'none';
    });
}

counters.forEach(ctr => {
    const pid = ctr.getAttribute('id');
    const plus = ctr.querySelector('.plus');
    const num = ctr.querySelector('.num');
    const minus = ctr.querySelector('.minus');
    const deleteBtn = ctr.querySelector('.deleteBtn');

    setAddFunction(plus, num, pid);
    setSubstractFunction(minus, num, pid);
    setDeleteFunction(deleteBtn, pid);
});

socketClient.on('deletedFromCart', async ({message}) => {
    alert(message);
});