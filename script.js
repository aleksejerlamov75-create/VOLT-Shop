function showPage(id) {
    var sections = document.querySelectorAll('.page-section');
    for (var i = 0; i < sections.length; i++) {
        sections[i].classList.remove('active');
    }
    var navs = document.querySelectorAll('nav a');
    for (var i = 0; i < navs.length; i++) {
        navs[i].classList.remove('active');
    }
    document.getElementById('page-' + id).classList.add('active');
    document.getElementById('nav-' + id).classList.add('active');
    window.scrollTo(0, 0);
    loadHeaderAvatar();
}

function loadHeaderAvatar() {
    var storedUser = localStorage.getItem('volt_user');
    if (storedUser) {
        var user = JSON.parse(storedUser);
        if (user.avatar) {
            var headerAvatar = document.getElementById('header-avatar-img');
            if (headerAvatar) {
                headerAvatar.src = user.avatar;
            }
            document.querySelector('.avatar').classList.add('logged-in');
        }
    }
}

var cart = [];
try { cart = JSON.parse(localStorage.getItem('volt_cart')); } catch(e) {}

function updCart() {
    var cnt = document.getElementById('cart-count');
    var box = document.getElementById('cart-items');
    var tot = document.getElementById('cart-total');
    cnt.innerText = cart.length;
    box.innerHTML = '';
    var s = 0;
    if (!cart.length) {
        box.innerHTML = '<p class="empty-cart">Пусто</p>';
    } else {
        for (var i = 0; i < cart.length; i++) {
            s += cart[i].price;
            box.innerHTML += '<div class="cart-item"><span>' + cart[i].name + '</span> <b>' + cart[i].price.toLocaleString() + ' ₽</b> <i class="fas fa-trash" style="color:red;cursor:pointer;margin-left:8px" onclick="delFromCart(' + i + ')"></i></div>';
        }
    }
    tot.innerText = s.toLocaleString() + ' ₽';
    localStorage.setItem('volt_cart', JSON.stringify(cart));
}

function addToCart(nm, pr) {
    cart.push({name: nm, price: pr});
    updCart();
    alert('Товар добавлен в корзину');
}

function delFromCart(idx) {
    cart.splice(idx, 1);
    updCart();
}

function toggleCart() {
    document.getElementById('cart-modal').classList.toggle('open');
}

var favs = [];
try { favs = JSON.parse(localStorage.getItem('volt_favs')); } catch(e) {}

function toggleFavorite(e, name, price) {
    var btn = e.currentTarget;
    var icon = btn.querySelector('i');
    var found = -1;

    for (var i = 0; i < favs.length; i++) {
        if (favs[i].name === name) {
            found = i;
            break;
        }
    }

    if (found >= 0) {
        favs.splice(found, 1);
        btn.classList.remove('active');
        if (icon) icon.className = 'far fa-heart';
    } else {
        favs.push({name: name, price: price});
        btn.classList.add('active');
        if (icon) icon.className = 'fas fa-heart';
    }

    localStorage.setItem('volt_favs', JSON.stringify(favs));
    updFavCount();
    updateFavoriteButtons();
}

function toggleFavorites() {
    var modal = document.getElementById('favorites-modal');
    if (modal.classList.contains('open')) {
        modal.classList.remove('open');
    } else {
        renderFavs();
        modal.classList.add('open');
    }
}

function renderFavs() {
    var box = document.getElementById('fav-items');
    if (!favs.length) {
        box.innerHTML = '<p class="empty-cart">Пусто</p>';
        return;
    }
    var html = '';
    for (var i = 0; i < favs.length; i++) {
        html += '<div class="fav-item">';
        html += '<div class="fav-item-info"><div class="fav-item-title">' + favs[i].name + '</div><div class="fav-item-price">' + favs[i].price.toLocaleString() + ' ₽</div></div>';
        html += '<i class="fas fa-times fav-remove" onclick="removeFav(' + i + ')"></i>';
        html += '</div>';
    }
    box.innerHTML = html;
}

function removeFav(index) {
    favs.splice(index, 1);
    localStorage.setItem('volt_favs', JSON.stringify(favs));
    renderFavs();
    updFavCount();
    updateFavoriteButtons();
}

function updFavCount() {
    document.getElementById('fav-count').innerText = favs.length;
}

function updateFavoriteButtons() {
    var btns = document.querySelectorAll('.action-btn, .btn-fav-inline');
    for (var b = 0; b < btns.length; b++) {
        var btn = btns[b];
        var name = btn.getAttribute('data-name');
        var icon = btn.querySelector('i');
        var found = -1;
        for (var i = 0; i < favs.length; i++) {
            if (favs[i].name === name) {
                found = i;
                break;
            }
        }
        if (found >= 0) {
            btn.classList.add('active');
            if (icon) icon.className = 'fas fa-heart';
        } else {
            btn.classList.remove('active');
            if (icon) icon.className = 'far fa-heart';
        }
    }
}

function filterProducts() {
    var q = document.getElementById('search-input').value.toLowerCase().trim();
    var cards = document.querySelectorAll('.product-card');
    for (var i = 0; i < cards.length; i++) {
        var title = cards[i].querySelector('.product-title').innerText.toLowerCase();
        if (title.indexOf(q) !== -1) {
            cards[i].style.display = '';
        } else {
            cards[i].style.display = 'none';
        }
    }
}

function toggleAccountModal() {
    var modal = document.getElementById('account-modal');
    if (modal.classList.contains('open')) {
        modal.classList.remove('open');
    } else {
        checkLoginStatus();
        modal.classList.add('open');
    }
}

function checkLoginStatus() {
    var isLoggedIn = localStorage.getItem('isLoggedIn');
    if (isLoggedIn === 'true') {
        showProfileForm();
    } else {
        showLoginForm();
    }
}

function showLoginForm() {
    document.getElementById('login-form').style.display = 'block';
    document.getElementById('reg-form').style.display = 'none';
    document.getElementById('profile-form').style.display = 'none';
    document.getElementById('account-modal-title').textContent = 'Вход в аккаунт';
}

function showRegForm() {
    document.getElementById('login-form').style.display = 'none';
    document.getElementById('reg-form').style.display = 'block';
    document.getElementById('profile-form').style.display = 'none';
    document.getElementById('account-modal-title').textContent = 'Регистрация';
}

function showProfileForm() {
    document.getElementById('login-form').style.display = 'none';
    document.getElementById('reg-form').style.display = 'none';
    document.getElementById('profile-form').style.display = 'block';
    document.getElementById('account-modal-title').textContent = 'Мой профиль';
    var u = JSON.parse(localStorage.getItem('volt_user') || '{}');
    document.getElementById('profile-name-display').textContent = u.name || 'Пользователь';
    document.getElementById('profile-email-display').textContent = u.email || '';
    document.getElementById('profile-avatar-small').src = u.avatar || 'Пустая аватарка.jpg';
}

function doRegister() {
    var name = document.getElementById('reg-name').value.trim();
    var email = document.getElementById('reg-email').value.trim();
    var pass = document.getElementById('reg-pass').value.trim();
    if (!name || !email || !pass) {
        alert('Заполните все поля');
        return;
    }
    var user = {
        name: name,
        email: email,
        pass: pass,
        phone: '',
        avatar: 'Пустая аватарка.jpg',
        addresses: []
    };
    localStorage.setItem('volt_user', JSON.stringify(user));
    localStorage.setItem('isLoggedIn', 'true');
    alert('Регистрация успешна!');
    showProfileForm();
    loadHeaderAvatar();
}

function doLogin() {
    var email = document.getElementById('login-email').value.trim();
    var pass = document.getElementById('login-pass').value.trim();
    var user = JSON.parse(localStorage.getItem('volt_user') || '{}');
    if (!user.email) {
        alert('Сначала зарегистрируйтесь');
        showRegForm();
        return;
    }
    if (user.email !== email || user.pass !== pass) {
        alert('Неверный email или пароль');
        return;
    }
    localStorage.setItem('isLoggedIn', 'true');
    showProfileForm();
    loadHeaderAvatar();
}

function doLogout() {
    localStorage.removeItem('isLoggedIn');
    document.getElementById('account-modal').classList.remove('open');
    document.getElementById('header-avatar-img').src = 'Пустая аватарка.jpg';
    document.querySelector('.avatar').classList.remove('logged-in');
    showLoginForm();
}

document.addEventListener('DOMContentLoaded', function() {
    updCart();
    updFavCount();
    loadHeaderAvatar();
    updateFavoriteButtons();
});