

const counters = document.querySelectorAll('.cartCounter');

const setAddFunction = (btn, num) => {
    btn.addEventListener('click', () => {
        let count = Number(num.innerHTML);
        count++;
        num.innerHTML = count;
    });
};

const setSubstractFunction = (btn, num) => {
    btn.addEventListener('click', () => {
        let count = Number(num.textContent);

        if (count > 1) {
            count--;
            num.innerHTML = count;
        }
    });
};

counters.forEach(ctr => {
    const plus = ctr.querySelector('.plus');
    const num = ctr.querySelector('.num');
    const minus = ctr.querySelector('.minus');

    setAddFunction(plus, num);
    setSubstractFunction(minus, num);
});