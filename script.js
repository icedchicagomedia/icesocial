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
        loadPosts();
    } else {
        alert('Invalid email or password. Please try again.');
    }
}

function forgotPassword() {
    var email = document.getElementById('forgot-email').value.trim();
    var user = users.find(u => u.email === email);
    if (user) {
        alert(`Password reset link has been sent to ${email}`);
    } else {
        alert('Email not found. Please try again.');
    }
}

function createAccount() {
    var email = document.getElementById('email-signup').value.trim();
    var password = document.getElementById('new-password').value.trim();
    var username = document.getElementById('new-username').value.trim();

    if (!email || !password || !username) {
        alert('All fields are required.');
        return;
    }

    var existingUser = users.find(u => u.email === email || u.username === username);
    if (existingUser) {
        alert('Email or username already taken. Please try a different one.');
        return;
    }

    var newUser = { email, password, username, posts: [] };
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));

    alert('Account created successfully. You can now sign in.');
    toggleFullScreenCreateAccount();
}

function toggleFullScreenCreateAccount() {
    var form = document.getElementById('fullscreen-create-account');
    if (form.style.display === 'flex') {
        form.style.display = 'none';
        document.getElementById('sign-in-container').style.display = 'block';
    } else {
        form.style.display = 'flex';
        document.getElementById('sign-in-container').style.display = 'none';
    }
}

function post() {
    var content = document.getElementById('post-content').value.trim();
    if (content) {
        var post = { content, likes: 0, reposts: 0, replies: [] };
        currentUser.posts.push(post);
        localStorage.setItem('users', JSON.stringify(users));
        document.getElementById('post-content').value = '';
        loadPosts();
    } else {
        showAlert('Cannot post empty content.');
    }
}

function loadPosts() {
    var postArea = document.getElementById('post-area');
    postArea.innerHTML = '';
    currentUser.posts.forEach((post, index) => {
        var postElement = document.createElement('div');
        postElement.className = 'post';
        postElement.innerHTML = `
            <p>${post.content}</p>
            <div class="post-actions">
                <button onclick="likePost(${index})"><i class="fa fa-heart"></i> ${post.likes}</button>
                <button onclick="repost(${index})"><i class="fa fa-retweet"></i> ${post.reposts}</button>
                <button onclick="reply(${index})"><i class="fa fa-reply"></i></button>
            </div>
            <div class="reply-section" id="reply-section-${index}">
                <textarea placeholder="Write a reply..."></textarea>
                <button onclick="submitReply(${index})">Submit Reply</button>
                <div class="replies">
                    ${post.replies.map(reply => `<p>${reply}</p>`).join('')}
                </div>
            </div>
        `;
        postArea.appendChild(postElement);
    });
}

function likePost(index) {
    currentUser.posts[index].likes++;
    localStorage.setItem('users', JSON.stringify(users));
    loadPosts();
}

function repost(index) {
    currentUser.posts[index].reposts++;
    localStorage.setItem('users', JSON.stringify(users));
    loadPosts();
}

function reply(index) {
    var replySection = document.getElementById(`reply-section-${index}`);
    if (replySection.classList.contains('active')) {
        replySection.classList.remove('active');
    } else {
        replySection.classList.add('active');
    }
}

function submitReply(index) {
    var replySection = document.getElementById(`reply-section-${index}`);
    var replyContent = replySection.querySelector('textarea').value.trim();
    if (replyContent) {
        currentUser.posts[index].replies.push(replyContent);
        localStorage.setItem('users', JSON.stringify(users));
        loadPosts();
    } else {
        showAlert('Cannot submit an empty reply.');
    }
}

function showAlert(message) {
    var alertBox = document.getElementById('custom-alert');
    var alertMessage = document.getElementById('alert-message');
    alertMessage.innerText = message;
    alertBox.style.display = 'block';
}

function closeAlert() {
    document.getElementById('custom-alert').style.display = 'none';
}

function showMainContent() {
    document.getElementById('main-content').style.display = 'block';
    document.getElementById('profile-section').style.display = 'none';
}

function showProfileSection() {
    document.getElementById('main-content').style.display = 'none';
    document.getElementById('profile-section').style.display = 'block';
    document.getElementById('profile-username').innerText = currentUser.username;
    // Populate user bio if available (not implemented in this example)
    // Populate user's posts in profile section
    var profilePosts = document.getElementById('profile-posts');
    profilePosts.innerHTML = '';
    currentUser.posts.forEach(post => {
        var postElement = document.createElement('div');
        postElement.className = 'post';
        postElement.innerHTML = `<p>${post.content}</p>`;
        profilePosts.appendChild(postElement);
    });
}
