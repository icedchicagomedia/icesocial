// Dummy user authentication (replace with actual implementation)
var currentUser = null;
var users = JSON.parse(localStorage.getItem('users')) || [
    { username: 'user1', password: 'password1', email: 'user1@example.com', posts: [] },
    { username: 'user2', password: 'password2', email: 'user2@example.com', posts: [] }
];

function signIn() {
    var email = document.getElementById('email-signin').value.trim();
    var password = document.getElementById('password-signin').value.trim();
    var user = users.find(u => u.email === email && u.password === password);
    if (user) {
        currentUser = user;
        document.getElementById('sign-in-container').style.display = 'none';
        document.getElementById('main-content').style.display = 'block';
        document.getElementById('bottom-nav').style.display = 'flex';
        document.getElementById('post-content').disabled = false;
        document.querySelector('.post-btn').disabled = false;
        showAlert('Signed in successfully.');
    } else {
        showAlert('Invalid email or password.');
    }
}

function forgotPassword() {
    var email = document.getElementById('forgot-email').value.trim();
    var user = users.find(u => u.email === email);
    if (user) {
        showAlert('Password reset link sent to your email.');
    } else {
        showAlert('Email not found.');
    }
}

function createAccount() {
    var email = document.getElementById('email-signup').value.trim();
    var password = document.getElementById('new-password').value.trim();
    var username = document.getElementById('new-username').value.trim();
    if (username.includes(' ')) {
        showAlert('Username must not contain spaces.');
        return;
    }
    if (users.some(u => u.email === email)) {
        showAlert('Email already in use.');
        return;
    }
    var newUser = { username: username, password: password, email: email, posts: [] };
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    showAlert('Account created successfully.');
    toggleFullScreenCreateAccount();
}

function toggleFullScreenCreateAccount() {
    var form = document.getElementById('fullscreen-create-account');
    form.style.display = form.style.display === 'flex' ? 'none' : 'flex';
}

function showMainContent() {
    document.getElementById('main-content').style.display = 'block';
    document.getElementById('profile-section').style.display = 'none';
}

function showProfileSection() {
    document.getElementById('main-content').style.display = 'none';
    document.getElementById('profile-section').style.display = 'block';
    if (currentUser) {
        document.getElementById('profile-username').innerText = currentUser.username;
        document.getElementById('profile-bio').innerText = 'This is the bio of ' + currentUser.username;
        document.getElementById('profile-posts').innerHTML = currentUser.posts.map(post => `<div>${post}</div>`).join('');
    }
}

function post() {
    var postContent = document.getElementById('post-content').value.trim();
    if (postContent && currentUser) {
        currentUser.posts.push(postContent);
        localStorage.setItem('users', JSON.stringify(users));
        var postElement = document.createElement('div');
        postElement.className = 'post';
        postElement.innerHTML = `
            <div>${postContent}</div>
            <div class="post-actions">
                <button onclick="toggleLike(this)">
                    <i class="fas fa-heart"></i>
                    <span class="counter">0</span>
                </button>
                <button><i class="fas fa-comment" onclick="showReplySection(this)"></i></button>
            </div>
            <div class="reply-section"></div>
        `;
        document.getElementById('post-area').appendChild(postElement);
        document.getElementById('post-content').value = '';
    }
}

function showReplySection(button) {
    var replySection = button.closest('.post').querySelector('.reply-section');
    replySection.classList.toggle('active');
}

function toggleLike(button) {
    var counter = button.querySelector('.counter');
    var count = parseInt(counter.innerText);
    if (button.classList.contains('liked')) {
        button.classList.remove('liked');
        counter.innerText = count - 1;
    } else {
        button.classList.add('liked');
        counter.innerText = count + 1;
    }
}

function showAlert(message) {
    var alertModal = document.getElementById('custom-alert');
    document.getElementById('alert-message').innerText = message;
    alertModal.style.display = 'block';
}

function closeAlert() {
    document.getElementById('custom-alert').style.display = 'none';
}
