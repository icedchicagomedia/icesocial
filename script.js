// User data (stored privately)
let users = JSON.parse(localStorage.getItem("users")) || [];
let loggedInUser = null;
let posts = JSON.parse(localStorage.getItem("posts")) || [];
let postCount = posts.length;

// Select elements
const postButton = document.getElementById("post-button");
const postSection = document.getElementById("post-section");
const profileSection = document.getElementById("profile-section");
const postsDiv = document.getElementById("posts");
const newPost = document.getElementById("new-post");
const homeLink = document.getElementById("home-link");
const profileLink = document.getElementById("profile-link");
const postCountSpan = document.getElementById("post-count");
const goHomeButton = document.getElementById("go-home");
const loginSection = document.getElementById("login-section");
const emailInput = document.getElementById("email");
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const loginButton = document.getElementById("login-button");
const loginError = document.getElementById("login-error");
const currentUserDisplay = document.getElementById("current-user");

// Function to save posts
function savePosts() {
  localStorage.setItem("posts", JSON.stringify(posts));
}

// Function to save users privately
function saveUsers() {
  localStorage.setItem("users", JSON.stringify(users));
}

// Escape potentially harmful characters for XSS protection
function escapeHtml(text) {
  const map = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  };
  return text.replace(/[&<>"']/g, function (m) {
    return map[m];
  });
}

// Function to create post elements
function createPostElement(post, index) {
  const postDiv = document.createElement("div");
  postDiv.className = "post";

  const textP = document.createElement("p");
  textP.innerText = `${post.username}: ${escapeHtml(post.text)}`; // Escape text to prevent XSS
  postDiv.appendChild(textP);

  // Display replies under each post
  const repliesDiv = document.createElement("div");
  repliesDiv.className = "replies";
  if (post.replies) {
    post.replies.forEach((reply) => {
      const replyP = document.createElement("p");
      replyP.innerText = `${reply.username}: ${escapeHtml(reply.text)}`;
      repliesDiv.appendChild(replyP);
    });
  }
  postDiv.appendChild(repliesDiv);

  const iconsDiv = document.createElement("div");
  iconsDiv.className = "icons";

  // Like button
  const likeButton = document.createElement("button");
  likeButton.innerHTML = "❤️ Like";
  likeButton.onclick = function () {
    likeButton.innerHTML =
      likeButton.innerHTML === "❤️ Like" ? "💔 Unlike" : "❤️ Like";
  };

  // Repost button
  const repostButton = document.createElement("button");
  repostButton.innerHTML = "🔁 Repost";
  repostButton.onclick = function () {
    const repostText = `Repost: ${post.text}`;
    posts.push({ text: repostText, username: loggedInUser.username });
    savePosts();
    displayPosts();
  };

  // Reply button
  const replyButton = document.createElement("button");
  replyButton.innerHTML = "💬 Reply";
  replyButton.onclick = function () {
    const replyText = prompt("Enter your reply:");
    if (replyText) {
      post.replies = post.replies || [];
      post.replies.push({ text: replyText, username: loggedInUser.username });
      savePosts();
      displayPosts();
    }
  };

  // Delete button (only for the post owner)
  if (post.username === loggedInUser.username) {
    const deleteButton = document.createElement("button");
    deleteButton.innerHTML = "🗑️ Delete";
    deleteButton.onclick = function () {
      posts.splice(index, 1);
      savePosts();
      displayPosts();
      postCount--;
      postCountSpan.innerText = postCount;
    };
    iconsDiv.appendChild(deleteButton);
  }

  iconsDiv.appendChild(likeButton);
  iconsDiv.appendChild(repostButton);
  iconsDiv.appendChild(replyButton);
  postDiv.appendChild(iconsDiv);

  return postDiv;
}

// Function to display all posts
function displayPosts() {
  postsDiv.innerHTML = "";
  posts.forEach((post, index) => {
    const postElement = createPostElement(post, index);
    postsDiv.appendChild(postElement);
  });
  postCountSpan.innerText = postCount;
}

// Add event listener for posting
postButton.addEventListener("click", () => {
  const postText = newPost.value.trim();
  if (postText) {
    posts.push({
      text: postText,
      username: loggedInUser.username,
      replies: [],
    });
    savePosts();
    displayPosts();
    newPost.value = "";
    postCount++;
    postCountSpan.innerText = postCount;
  }
});

// Add event listener for login/sign-up
loginButton.addEventListener("click", () => {
  const email = emailInput.value.trim();
  const username = usernameInput.value.trim();
  const password = passwordInput.value.trim();

  if (!email || !username || !password) {
    loginError.innerText = "All fields are required!";
    return;
  }

  // Ensure email and username are unique
  const existingUser = users.find(
    (user) => user.email === email || user.username === username
  );

  if (existingUser) {
    // Existing user: Validate password
    if (existingUser.password === password) {
      loggedInUser = existingUser;
      loginSection.classList.add("hidden");
      postSection.classList.remove("hidden");
      currentUserDisplay.innerText = loggedInUser.username;
      displayPosts();
    } else {
      loginError.innerText = "Incorrect password!";
    }
  } else {
    // New user: Ensure unique email and username
    if (
      users.some((user) => user.email === email || user.username === username)
    ) {
      loginError.innerText = "Email or Username already taken!";
      return;
    }

    // Register new user
    loggedInUser = { email, username, password };
    users.push(loggedInUser);
    saveUsers();
    loginSection.classList.add("hidden");
    postSection.classList.remove("hidden");
    currentUserDisplay.innerText = loggedInUser.username;
    displayPosts();
  }
});

// Navigate to profile
profileLink.addEventListener("click", () => {
  postSection.classList.add("hidden");
  profileSection.classList.remove("hidden");
  document.getElementById("profile-username").innerText = loggedInUser.username;
  document.getElementById("profile-email").innerText = loggedInUser.email; // Kept private, not public
});

// Go back to home
goHomeButton.addEventListener("click", () => {
  profileSection.classList.add("hidden");
  postSection.classList.remove("hidden");
});

// Initial display of posts
displayPosts();
