// auth.js - Comprehensive authentication system
(function() {
  const CURRENT_USER_KEY = "currentUser";

  // ==========================================
  // AUTH HELPER FUNCTIONS
  // ==========================================

  function getCurrentUser() {
    const userJson = localStorage.getItem(CURRENT_USER_KEY);
    if (!userJson) return null;
    try {
      return JSON.parse(userJson);
    } catch (e) {
      return null;
    }
  }

  function setCurrentUser(user) {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  }

  function clearCurrentUser() {
    localStorage.removeItem(CURRENT_USER_KEY);
  }

  function isAdmin(user) {
    return user && user.role === "admin";
  }

  function isStudent(user) {
    return user && user.role === "student";
  }

  // ==========================================
  // SIGNUP PAGE
  // ==========================================
  const signupForm = document.getElementById("signup-form");

  if (signupForm) {
    signupForm.addEventListener("submit", async function(e) {
      e.preventDefault();

      const name = document.getElementById("signup-name").value.trim();
      const email = document.getElementById("signup-email").value.trim();
      const password = document.getElementById("signup-password").value;
      const confirmPassword = document.getElementById("signup-confirm").value;
      const role = document.getElementById("signup-role").value;
      const errorDiv = document.getElementById("error-message");

      // Clear previous errors
      errorDiv.style.display = "none";
      errorDiv.textContent = "";

      // Validation
      if (!name || !email || !password || !role) {
        errorDiv.textContent = "All fields are required";
        errorDiv.style.display = "block";
        return;
      }

      if (password.length < 8) {
        errorDiv.textContent = "Password must be at least 8 characters";
        errorDiv.style.display = "block";
        return;
      }

      if (password !== confirmPassword) {
        errorDiv.textContent = "Passwords do not match";
        errorDiv.style.display = "block";
        return;
      }

      try {
        const response = await fetch("/api/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password, role })
        });

        const data = await response.json();

        if (!response.ok) {
          errorDiv.textContent = data.error || "Signup failed";
          errorDiv.style.display = "block";
          return;
        }

        // Success - save user and redirect
        setCurrentUser(data);
        alert("Account created successfully!");
        window.location.href = role === "admin" ? "manage.html" : "index.html";
      } catch (err) {
        console.error("Signup error:", err);
        errorDiv.textContent = "Network error. Make sure you're accessing via http://localhost:3000/signup.html (not file://)";
        errorDiv.style.display = "block";
      }
    });
  }

  // ==========================================
  // LOGIN PAGE
  // ==========================================
  const loginForm = document.getElementById("login-form");

  if (loginForm) {
    loginForm.addEventListener("submit", async function(e) {
      e.preventDefault();

      const email = document.getElementById("login-email").value.trim();
      const password = document.getElementById("login-password").value;
      const errorDiv = document.getElementById("error-message");

      // Clear previous errors
      errorDiv.style.display = "none";
      errorDiv.textContent = "";

      if (!email || !password) {
        errorDiv.textContent = "Email and password are required";
        errorDiv.style.display = "block";
        return;
      }

      try {
        const response = await fetch("/api/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (!response.ok) {
          errorDiv.textContent = data.error || "Login failed";
          errorDiv.style.display = "block";
          return;
        }

        // Success - save user and redirect
        setCurrentUser(data);
        window.location.href = data.role === "admin" ? "manage.html" : "index.html";
      } catch (err) {
        console.error("Login error:", err);
        errorDiv.textContent = "Network error. Make sure you're accessing via http://localhost:3000/login.html (not file://)";
        errorDiv.style.display = "block";
      }
    });
  }

  // ==========================================
  // PROFILE PAGE
  // ==========================================
  const profileNameInput = document.querySelector('input[type="text"][value="Jane Doe"]');
  const profileEmailInput = document.querySelector('input[type="email"][value="name@university.edu"]');

  if (profileNameInput && profileEmailInput) {
    const user = getCurrentUser();

    if (!user) {
      // Not logged in - redirect to login
      window.location.href = "login.html";
    } else {
      // Populate profile with current user data
      profileNameInput.value = user.name || "";
      profileEmailInput.value = user.email || "";

      // Add role display
      const titleBlock = document.querySelector('.title-block');
      if (titleBlock && !document.getElementById('user-role-display')) {
        const roleDiv = document.createElement('div');
        roleDiv.id = 'user-role-display';
        roleDiv.style.marginTop = '8px';
        roleDiv.innerHTML = `<span class="muted">Account Type: <strong>${user.role === 'admin' ? 'Administrator' : 'Student'}</strong></span>`;
        titleBlock.appendChild(roleDiv);
      }

      // Add logout button if not exists
      const formActions = document.querySelector('.form-actions');
      if (formActions && !document.getElementById('logout-btn')) {
        const logoutBtn = document.createElement('button');
        logoutBtn.id = 'logout-btn';
        logoutBtn.type = 'button';
        logoutBtn.className = 'btn';
        logoutBtn.textContent = 'Logout';
        logoutBtn.style.marginLeft = 'auto';
        logoutBtn.addEventListener('click', function() {
          if (confirm('Are you sure you want to logout?')) {
            clearCurrentUser();
            window.location.href = 'login.html';
          }
        });
        formActions.appendChild(logoutBtn);
      }
    }
  }

  // ==========================================
  // NAVIGATION - UPDATE BASED ON AUTH STATE
  // ==========================================
  const currentUser = getCurrentUser();
  const topbarActions = document.querySelector('.topbar-row > div:last-child');

  if (topbarActions) {
    // Clear existing buttons
    topbarActions.innerHTML = '';

    if (currentUser) {
      // User is logged in
      const profileBtn = document.createElement('a');
      profileBtn.className = 'btn-pill';
      profileBtn.href = 'profile.html';
      profileBtn.textContent = currentUser.name || 'Profile';
      topbarActions.appendChild(profileBtn);

      const logoutBtn = document.createElement('a');
      logoutBtn.className = 'btn-pill';
      logoutBtn.href = '#';
      logoutBtn.textContent = 'Logout';
      logoutBtn.addEventListener('click', function(e) {
        e.preventDefault();
        if (confirm('Are you sure you want to logout?')) {
          clearCurrentUser();
          window.location.href = 'login.html';
        }
      });
      topbarActions.appendChild(logoutBtn);
    } else {
      // User is not logged in
      const loginBtn = document.createElement('a');
      loginBtn.className = 'btn-pill';
      loginBtn.href = 'login.html';
      loginBtn.textContent = 'Login';
      topbarActions.appendChild(loginBtn);

      const signupBtn = document.createElement('a');
      signupBtn.className = 'btn-pill';
      signupBtn.href = 'signup.html';
      signupBtn.textContent = 'Sign Up';
      topbarActions.appendChild(signupBtn);
    }
  }

  // ==========================================
  // HIDE/SHOW ADMIN LINKS BASED ON ROLE
  // ==========================================
  const moreMenu = document.querySelector('.more-menu');

  if (moreMenu) {
    const adminLinks = [
      'manage.html',
      'booking-request.html',
      'admin-availability.html',
      'admin-statistics.html'
    ];

    // Get all links in the more menu
    const allLinks = moreMenu.querySelectorAll('a');

    allLinks.forEach(link => {
      const href = link.getAttribute('href');
      const isAdminLink = adminLinks.some(adminHref => href.includes(adminHref));

      if (isAdminLink) {
        // Hide admin links if not admin
        if (!isAdmin(currentUser)) {
          link.style.display = 'none';
        } else {
          link.style.display = '';
        }
      }
    });
  }

  // ==========================================
  // PROTECT ADMIN PAGES
  // ==========================================
  const adminPages = [
    'manage.html',
    'booking-request.html',
    'admin-availability.html',
    'admin-statistics.html'
  ];

  const currentPage = window.location.pathname.split('/').pop();

  if (adminPages.includes(currentPage)) {
    if (!currentUser) {
      // Not logged in - redirect to login
      alert('Please login to access this page');
      window.location.href = 'login.html';
    } else if (!isAdmin(currentUser)) {
      // Logged in but not admin
      alert('Access denied. Admin privileges required.');
      window.location.href = 'index.html';
    }
  }

  // ==========================================
  // MAKE AUTH FUNCTIONS GLOBALLY AVAILABLE
  // ==========================================
  window.auth = {
    getCurrentUser,
    setCurrentUser,
    clearCurrentUser,
    isAdmin,
    isStudent,
    logout: function() {
      clearCurrentUser();
      window.location.href = 'login.html';
    }
  };
})();
