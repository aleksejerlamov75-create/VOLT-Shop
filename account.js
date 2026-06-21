function toggleForms(show) {
    document.getElementById('login-section').style.display = show === 'login' ? 'block' : 'none';
    document.getElementById('reg-section').style.display = show === 'reg' ? 'block' : 'none';
}

function doRegister() {
    const name = document.getElementById('reg-name').value.trim();
    const email = document.getElementById('reg-email').value.trim();
    const pass = document.getElementById('reg-pass').value.trim();
    
    if (!name || !email || !pass) {
        alert('Заполните все поля');
        return;
    }

    const user = {
        name: name,
        email: email,
        pass: pass,
        phone: 'Введите номер телефона',
        avatar: 'фото/пустая аватарка.png',
        addresses: []
    };

    localStorage.setItem('volt_user', JSON.stringify(user));
    localStorage.setItem('isLoggedIn', 'true');

    loadProfile();
    showProfile();
    alert('Регистрация успешна');
}

function doLogin() {
    const email = document.getElementById('login-email').value.trim();
    const pass = document.getElementById('login-pass').value.trim();
    const user = JSON.parse(localStorage.getItem('volt_user') || '{}');
    
    if (!user.email) {
        alert('Сначала зарегистрируйтесь');
        toggleForms('reg');
        return;
    }

    if (user.email !== email || user.pass !== pass) {
        alert('Неверный email или пароль');
        return;
    }

    localStorage.setItem('isLoggedIn', 'true');
    loadProfile();
    showProfile();
}

function loadProfile() {
    const u = JSON.parse(localStorage.getItem('volt_user') || '{}');
    document.getElementById('profile-name-display').textContent = u.name || 'Пользователь';
    document.getElementById('profile-email-display').textContent = u.email || '';
    document.getElementById('p-name').value = u.name || '';
    document.getElementById('p-email').value = u.email || '';
    document.getElementById('p-phone').value = u.phone || '';
    document.getElementById('profile-avatar').src = u.avatar || 'фото/пустая аватарка.png';
}

function showProfile() {
    document.getElementById('login-section').style.display = 'none';
    document.getElementById('reg-section').style.display = 'none';
    document.getElementById('profile-section').style.display = 'flex';
    document.getElementById('security-section').style.display = 'none';
    document.getElementById('orders-section').style.display = 'none';
    document.getElementById('addresses-section').style.display = 'none';
}

function saveProfile() {
    const u = JSON.parse(localStorage.getItem('volt_user') || '{}');
    u.name = document.getElementById('p-name').value;
    u.phone = document.getElementById('p-phone').value;
    localStorage.setItem('volt_user', JSON.stringify(u));
    document.getElementById('profile-name-display').textContent = u.name;
    alert('Данные сохранены');
}

function showSection(section) {
    document.getElementById('profile-section').style.display = 'none';
    if (section === 'security') {
        document.getElementById('security-section').style.display = 'block';
        document.getElementById('sec-old').value = '';
        document.getElementById('sec-new').value = '';
        document.getElementById('sec-confirm').value = '';
    } else if (section === 'orders') {
        document.getElementById('orders-section').style.display = 'block';
        renderOrders();
    } else if (section === 'addresses') {
        document.getElementById('addresses-section').style.display = 'block';
        renderAddresses();
    }
}

function backToProfile() {
    document.getElementById('security-section').style.display = 'none';
    document.getElementById('orders-section').style.display = 'none';
    document.getElementById('addresses-section').style.display = 'none';
    document.getElementById('profile-section').style.display = 'flex';
}

function changePass() {
    const oldPass = document.getElementById('sec-old').value;
    const newPass = document.getElementById('sec-new').value;
    const confirmPass = document.getElementById('sec-confirm').value;
    const u = JSON.parse(localStorage.getItem('volt_user') || '{}');
    
    if (oldPass !== u.pass) {
        alert('Неверный текущий пароль');
        return;
    }

    if (!newPass || newPass.length < 6) {
        alert('Новый пароль должен содержать минимум 6 символов');
        return;
    }

    if (newPass !== confirmPass) {
        alert('Пароли не совпадают');
        return;
    }

    u.pass = newPass;
    localStorage.setItem('volt_user', JSON.stringify(u));
    alert('Пароль успешно изменён');
    backToProfile();
}

function renderOrders() {
    const orders = JSON.parse(localStorage.getItem('volt_orders') || '[]');
    const container = document.getElementById('orders-list');
    
    if (orders.length === 0) {
        container.innerHTML = '<p style="color:var(--text-light); text-align:center">У вас пока нет заказов</p>';
        return;
    }

    let html = '';
    for (let i = 0; i < orders.length; i++) {
        const order = orders[i];
        html += '<div style="background:#f8fafc; padding:16px; border-radius:8px; margin-bottom:12px; border-left:3px solid var(--primary)">';
        html += '<div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px"><strong>Заказ #' + order.id + '</strong><span style="background:#e6fffa; color:#2c7a7b; padding:2px 10px; border-radius:12px; font-size:0.85rem">' + order.status + '</span></div>';
        html += '<div style="color:var(--text-light); font-size:0.9rem; margin-bottom:8px">' + order.date + '</div>';
        html += '<div style="margin-bottom:8px">' + order.items + '</div>';
        html += '<div style="font-weight:600; color:var(--primary)">' + order.total + '</div>';
        if (order.tracking) {
            html += '<div style="font-size:0.85rem; color:var(--text-light); margin-top:8px">Трекинг: ' + order.tracking + '</div>';
        }
        html += '</div>';
    }
    container.innerHTML = html;
}

function renderAddresses() {
    const u = JSON.parse(localStorage.getItem('volt_user') || '{}');
    const container = document.getElementById('addresses-list');
    const addresses = u.addresses || [];
    
    if (addresses.length === 0) {
        container.innerHTML = '<p style="color:var(--text-light); text-align:center">Адреса не добавлены</p>';
        return;
    }

    let html = '';
    for (let i = 0; i < addresses.length; i++) {
        const addr = addresses[i];
        html += '<div style="background:#f8fafc; padding:12px; border-radius:8px; margin-bottom:10px; display:flex; justify-content:space-between; align-items:center">';
        html += '<div><div style="font-weight:500">' + addr.name + '</div><div style="color:var(--text-light); font-size:0.9rem">' + addr.address + '</div>';
        if (addr.phone) {
            html += '<div style="color:var(--text-light); font-size:0.9rem">' + addr.phone + '</div>';
        }
        html += '</div>';
        html += '<button class="btn-reg" style="width:auto; padding:6px 12px; font-size:0.85rem" onclick="deleteAddress(' + i + ')">Удалить</button>';
        html += '</div>';
    }
    container.innerHTML = html;
}

function addAddress() {
    const name = prompt('Название адреса (Дом, Работа, и т.д.):');
    if (!name) return;
    const address = prompt('Адрес доставки:');
    if (!address) return;
    const phone = prompt('Телефон для доставки (необязательно):') || '';

    const u = JSON.parse(localStorage.getItem('volt_user') || '{}');
    if (!u.addresses) u.addresses = [];

    u.addresses.push({ name: name, address: address, phone: phone });
    localStorage.setItem('volt_user', JSON.stringify(u));

    renderAddresses();
    alert('Адрес добавлен');
}

function deleteAddress(index) {
    if (!confirm('Удалить этот адрес?')) return;
    const u = JSON.parse(localStorage.getItem('volt_user') || '{}');
    if (u.addresses) {
        u.addresses.splice(index, 1);
        localStorage.setItem('volt_user', JSON.stringify(u));
        renderAddresses();
    }
}

function doLogout() {
    localStorage.removeItem('isLoggedIn');
    document.getElementById('login-section').style.display = 'block';
    document.getElementById('profile-section').style.display = 'none';
    document.getElementById('security-section').style.display = 'none';
    document.getElementById('orders-section').style.display = 'none';
    document.getElementById('addresses-section').style.display = 'none';
    window.location.href = 'index.html';
}

document.addEventListener('DOMContentLoaded', function() {
    if (localStorage.getItem('isLoggedIn') === 'true') {
        loadProfile();
        showProfile();
    }
});