// js/auth.js - Login & Register logic

// Toggle forms
document.getElementById('showRegister')?.addEventListener('click', (e) => {
    e.preventDefault();
    document.getElementById('loginForm').classList.add('d-none');
    document.getElementById('registerForm').classList.remove('d-none');
});
document.getElementById('showLogin')?.addEventListener('click', (e) => {
    e.preventDefault();
    document.getElementById('registerForm').classList.add('d-none');
    document.getElementById('loginForm').classList.remove('d-none');
});

function showAlert(msg, type = 'danger') {
    const box = document.getElementById('alertBox');
    box.className = `alert alert-${type}`;
    box.innerText = msg;
    box.classList.remove('d-none');
    setTimeout(() => box.classList.add('d-none'), 3000);
}

// LOGIN
document.getElementById('loginForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPass').value;

    const user = DB.findUserByEmail(email);
    if (!user) {
        showAlert('Bu email topilmadi!');
        return;
    }
    if (user.password !== password) {
        showAlert('Parol noto\'g\'ri!');
        return;
    }

    DB.setSession(user);
    window.location.href = 'dashboard.html';
});

// REGISTER
document.getElementById('registerForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const username = document.getElementById('regUser').value;
    const email = document.getElementById('regEmail').value;
    const password = document.getElementById('regPass').value;

    if (password.length < 6) {
        showAlert('Parol kamida 6 ta belgidan iborat bo\'lishi kerak!');
        return;
    }

    const result = DB.addUser(username, email, password);
    if (result.error) {
        showAlert(result.error);
        return;
    }

    showAlert('Muvaffaqiyatli ro\'yxatdan o\'tdingiz! Endi kiring.', 'success');
    setTimeout(() => {
        document.getElementById('registerForm').classList.add('d-none');
        document.getElementById('loginForm').classList.remove('d-none');
    }, 1500);
});
