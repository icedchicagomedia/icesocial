<?php
echo '<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Twitter-like Website</title>
    <link rel="stylesheet" href="styles.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
    <style>
        /* Your existing CSS styles here */
        /* Additional styles for forgot password */
        .forgot-password {
            margin-top: 20px;
            text-align: center;
        }
        .forgot-password input {
            padding: 8px;
            margin: 5px;
        }
        .forgot-password button {
            padding: 10px 20px;
            background-color: #007bff;
            color: #fff;
            border: none;
            border-radius: 4px;
            cursor: pointer;
        }
        .forgot-password button:hover {
            background-color: #0056b3;
        }

        /* Style for create account button */
        .create-account-btn {
            display: inline-block;
            padding: 10px 20px;
            background-color: #28a745;
            color: #fff;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            text-decoration: none;
            margin-top: 10px;
            text-align: center;
        }
        .create-account-btn:hover {
            background-color: #218838;
        }

        /* Style for full-screen create account form */
        .fullscreen-create-account {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.5); /* semi-transparent background */
            display: none;
            justify-content: center;
            align-items: center;
        }
        .create-account-box {
            background-color: #fff;
            padding: 20px;
            border-radius: 8px;
            width: 300px;
            max-width: 80%;
            text-align: center;
        }

        /* Bottom navigation bar */
        .bottom-nav {
            position: fixed;
            bottom: 0;
            width: 100%;
            background-color: #333;
            color: white;
            display: flex;
            justify-content: space-around;
            padding: 10px 0;
        }

        .bottom-nav i {
            font-size: 24px;
            cursor: pointer;
        }

        /* Profile section */
        .profile-section {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: #f9f9f9;
            padding: 20px;
            box-sizing: border-box;
        }

        .profile-section-content {
            background-color: #fff;
            padding: 20px;
            border-radius: 8px;
            width: 300px;
            max-width: 80%;
            margin: 0 auto;
            text-align: center;
        }

        .profile-section img {
            width: 100px;
            height: 100px;
            border-radius: 50%;
        }

        /* Additional styles for post area */
        .post {
            background-color: white;
            padding: 10px;
            margin-bottom: 10px;
            border-radius: 5px;
            color: black; /* Set post text color to black */
        }

        .post-actions {
            display: flex;
            margin-top: 10px;
            justify-content: space-between; /* Ensure icons do not cover the text */
        }

        .post-actions button {
            background: none;
            border: none;
            cursor: pointer;
            padding: 5px;
        }

        .post-actions button i {
            font-size: 20px;
        }

        .post-content {
            width: 100%;
            box-sizing: border-box;
            padding: 10px;
            border: 1px solid #ccc;
            border-radius: 5px;
            margin-bottom: 10px;
            resize: vertical;
        }

        /* Reply section */
        .reply-section {
            display: none;
            margin-top: 10px;
            padding: 10px;
            border: 1px solid #ccc;
            border-radius: 5px;
        }

        .reply-section.active {
            display: block;
        }

        /* Custom alert styles */
        .custom-alert {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background-color: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            z-index: 1000;
            display: none;
            text-align: center;
        }
        .custom-alert .close-btn {
            background-color: #007bff;
            color: #fff;
            border: none;
            border-radius: 4px;
            padding: 5px 10px;
            cursor: pointer;
            margin-top: 10px;
        }
        .custom-alert .close-btn:hover {
            background-color: #0056b3;
        }
    </style>
</head>
<body>
    <div class="container">
        <!-- Sign In Container -->
        <div class="sign-in-container" id="sign-in-container">
            <div class="sign-in-box">
                <h2>Sign In</h2>
                <input type="email" id="email-signin" placeholder="Email" required>
                <input type="password" id="password-signin" placeholder="Password" required>
                <button onclick="signIn()">Sign In</button>
                <div class="forgot-password">
                    <input type="email" id="forgot-email" placeholder="Enter your email">
                    <button onclick="forgotPassword()">Forgot Password?</button>
                </div>
                <button class="create-account-btn" onclick="toggleFullScreenCreateAccount()">Create Account</button>
            </div>
        </div>

        <!-- Main Content -->
        <div class="main-content" id="main-content" style="display: none;">
            <div class="post-form">
                <textarea id="post-content" class="post-content" placeholder="What\'s on your mind?" disabled></textarea>
                <button class="post-btn" onclick="post()" disabled>Post</button>
            </div>
            <div id="post-area" class="post-area">
                <!-- Posts will be dynamically added here -->
            </div>
        </div>
    </div>

    <!-- Full-screen create account form -->
    <div class="fullscreen-create-account" id="fullscreen-create-account">
        <div class="create-account-box">
            <h2>Create Account</h2>
            <input type="email" id="email-signup" placeholder="Email" required>
            <input type="password" id="new-password" placeholder="Password" required>
            <input type="text" id="new-username" placeholder="Username (no spaces)" required pattern="[^\s]+" title="Username must not contain spaces">
            <button class="create-account-btn" onclick="createAccount()">Create Account</button>
            <div class="toggle-sign-up" onclick="toggleFullScreenCreateAccount()">Back to Sign In</div>
        </div>
    </div>

    <!-- Bottom navigation bar -->
    <div class="bottom-nav" id="bottom-nav" style="display: none;">
        <i class="fas fa-home" onclick="showMainContent()"></i>
        <i class="fas fa-search"></i>
        <i class="fas fa-bell"></i>
        <i class="fas fa-user" onclick="showProfileSection()"></i>
    </div>

    <!-- Profile section -->
    <div class="profile-section" id="profile-section">
        <div class="profile-section-content">
            <img src="default_profile.jpg" alt="Profile Picture">
            <h3>Username: <span id="profile-username"></span></h3>
            <p>Bio: <span id="profile-bio"></span></p>
            <h4>Posts:</h4>
            <div id="profile-posts"></div>
            <button onclick="showMainContent()">Back to Home</button>
        </div>
    </div>

    <!-- Custom Alert Modal -->
    <div class="custom-alert" id="custom-alert">
        <p id="alert-message"></p>
        <button class="close-btn" onclick="closeAlert()">Close</button>
    </div>

    <script>
        // Dummy user authentication (replace with actual implementation)
        var currentUser = null;
        var users = JSON.parse(localStorage.getItem(\'users\')) || [
            { username: \'user1\', password: \'password1\', email: \'user1@example.com\', posts: [] },
            { username: \'user2\', password: \'password2\', email: \'user2@example.com\', posts: [] }
        ];

        function signIn() {
            var email = document.getElementById(\'email-signin\').value.trim();
            var password = document.getElementById(\'password-signin\').value.trim();

            if (email && password) {
                var user = users.find(user => user.email === email && user.password === password);
                if (user) {
                    currentUser = user;
                    showMainContent();
                    document.getElementById(\'post-content\').disabled = false;
                    document.querySelector(\'.post-btn\').disabled = false;
                } else {
                    showAlert(\'Invalid email or password.\');
                }
            }
        }

        function createAccount() {
            var email = document.getElementById(\'email-signup\').value.trim();
            var password = document.getElementById(\'new-password\').value.trim();
            var username = document.getElementById(\'new-username\').value.trim();

            if (email && password && username) {
                var existingUser = users.find(user => user.email === email || user.username === username);
                if (existingUser) {
                    showAlert(\'Email or username already exists.\');
                } else {
                    var newUser = { email: email, password: password, username: username, posts: [] };
                    users.push(newUser);
                    localStorage.setItem(\'users\', JSON.stringify(users));
                    showAlert(\'Account created successfully. Please sign in.\');
                    toggleFullScreenCreateAccount();
                }
            }
        }

        function toggleFullScreenCreateAccount() {
            var createAccountForm = document.getElementById(\'fullscreen-create-account\');
            createAccountForm.style.display = createAccountForm.style.display === \'flex\' ? \'none\' : \'flex\';
        }

        function showMainContent() {
            document.getElementById(\'sign-in-container\').style.display = \'none\';
            document.getElementById(\'main-content\').style.display = \'block\';
            document.getElementById(\'bottom-nav\').style.display = \'flex\';
            document.getElementById(\'profile-section\').style.display = \'none\';
        }

        function showProfileSection() {
            if (currentUser) {
                document.getElementById(\'profile-username\').textContent = currentUser.username;
                document.getElementById(\'profile-bio\').textContent = currentUser.bio || \'No bio available\';
                displayUserPosts(currentUser.posts, \'profile-posts\');
                document.getElementById(\'profile-section\').style.display = \'block\';
                document.getElementById(\'main-content\').style.display = \'none\';
            }
        }

        function displayUserPosts(posts, containerId) {
            var container = document.getElementById(containerId);
            container.innerHTML = \'\';
            posts.forEach(post => {
                var postElement = document.createElement(\'div\');
                postElement.className = \'post\';
                postElement.innerHTML = `<p>${post.content}</p>`;
                container.appendChild(postElement);
            });
        }

        function post() {
            var postContent = document.getElementById(\'post-content\').value.trim();
            if (postContent) {
                var newPost = { content: postContent, likes: 0, reposts: 0 };
                currentUser.posts.push(newPost);
                displayUserPosts(currentUser.posts, \'post-area\');
                document.getElementById(\'post-content\').value = \'\';
            }
        }

        function showAlert(message) {
            document.getElementById(\'alert-message\').textContent = message;
            document.getElementById(\'custom-alert\').style.display = \'block\';
        }

        function closeAlert() {
            document.getElementById(\'custom-alert\').style.display = \'none\';
        }
    </script>
</body>
</html>';
?>


