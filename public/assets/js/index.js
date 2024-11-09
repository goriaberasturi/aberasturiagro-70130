const userBtn = document.querySelector('.user-logos.user');
const userDropdown = document.querySelector('.dropdown');
const logoutBtn = document.querySelector('.logoutBtn');

if(userBtn) {
    userBtn.addEventListener('click', e => {
        const toggle = window.getComputedStyle(userDropdown).display;
        
        if(toggle != 'none') {
            userDropdown.style.display = 'none';
        } else {
            userDropdown.style.display = 'block';
        }
    });
}