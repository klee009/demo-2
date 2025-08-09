
// Authentication system
let currentUser = null;

// Sample users database (in real app, this would be server-side)
let users = [
    {
        id: 1,
        name: "Nguyễn Văn A",
        email: "admin@freshfruit.vn",
        phone: "0123456789",
        password: "123456"
    }
];

// Check if user is logged in on page load
window.addEventListener('load', function() {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        updateUIForLoggedInUser();
    }
});

// Modal controls
const authModal = document.getElementById('authModal');
const loginBtn = document.getElementById('loginBtn');
const closeModal = document.getElementById('closeModal');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const showRegister = document.getElementById('showRegister');
const showLogin = document.getElementById('showLogin');

// User menu controls
const userMenu = document.getElementById('userMenu');
const userIcon = document.getElementById('userIcon');
const userDropdown = document.getElementById('userDropdown');
const logoutBtn = document.getElementById('logoutBtn');

// Open login modal
loginBtn.addEventListener('click', function(e) {
    e.preventDefault();
    authModal.classList.add('active');
    showLoginForm();
});

// Close modal
closeModal.addEventListener('click', function() {
    authModal.classList.remove('active');
    clearForms();
});

// Close modal when clicking outside
window.addEventListener('click', function(e) {
    if (e.target === authModal) {
        authModal.classList.remove('active');
        clearForms();
    }
});

// Toggle between login and register forms
showRegister.addEventListener('click', function(e) {
    e.preventDefault();
    showRegisterForm();
});

showLogin.addEventListener('click', function(e) {
    e.preventDefault();
    showLoginForm();
});

// User menu toggle
userIcon.addEventListener('click', function() {
    userDropdown.classList.toggle('active');
});

// Close user menu when clicking outside
document.addEventListener('click', function(e) {
    if (!userMenu.contains(e.target)) {
        userDropdown.classList.remove('active');
    }
});

// Logout functionality
logoutBtn.addEventListener('click', function(e) {
    e.preventDefault();
    logout();
});

// Login form submission
document.getElementById('loginFormElement').addEventListener('submit', function(e) {
    e.preventDefault();
    handleLogin();
});

// Register form submission
document.getElementById('registerFormElement').addEventListener('submit', function(e) {
    e.preventDefault();
    handleRegister();
});

function showLoginForm() {
    loginForm.style.display = 'block';
    registerForm.style.display = 'none';
    clearMessages();
}

function showRegisterForm() {
    loginForm.style.display = 'none';
    registerForm.style.display = 'block';
    clearMessages();
}

function handleLogin() {
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    // Find user
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
        currentUser = user;
        localStorage.setItem('currentUser', JSON.stringify(user));
        showMessage('loginSuccess', 'Đăng nhập thành công!');
        
        setTimeout(() => {
            authModal.classList.remove('active');
            updateUIForLoggedInUser();
            clearForms();
        }, 1500);
    } else {
        showMessage('loginError', 'Email hoặc mật khẩu không đúng!');
    }
}

function handleRegister() {
    const name = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const phone = document.getElementById('registerPhone').value;
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('registerConfirmPassword').value;

    // Validation
    if (password !== confirmPassword) {
        showMessage('registerError', 'Mật khẩu xác nhận không khớp!');
        return;
    }

    if (users.find(u => u.email === email)) {
        showMessage('registerError', 'Email đã được sử dụng!');
        return;
    }

    // Create new user
    const newUser = {
        id: users.length + 1,
        name,
        email,
        phone,
        password
    };

    users.push(newUser);
    showMessage('registerSuccess', 'Đăng ký thành công! Vui lòng đăng nhập.');

    setTimeout(() => {
        showLoginForm();
        document.getElementById('loginEmail').value = email;
    }, 1500);
}

function updateUIForLoggedInUser() {
    // Hide login button, show user menu
    document.querySelector('.auth-section').style.display = 'none';
    userMenu.style.display = 'block';

    // Update user info
    document.getElementById('userName').textContent = currentUser.name;
    document.getElementById('userEmail').textContent = currentUser.email;
}

function logout() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    
    // Show login button, hide user menu
    document.querySelector('.auth-section').style.display = 'block';
    userMenu.style.display = 'none';
    userDropdown.classList.remove('active');
}

function showMessage(elementId, message) {
    const element = document.getElementById(elementId);
    element.textContent = message;
    element.style.display = 'block';
    
    // Hide other messages
    const messages = document.querySelectorAll('.error-message, .success-message');
    messages.forEach(msg => {
        if (msg.id !== elementId) {
            msg.style.display = 'none';
        }
    });
}

function clearMessages() {
    const messages = document.querySelectorAll('.error-message, .success-message');
    messages.forEach(msg => {
        msg.style.display = 'none';
        msg.textContent = '';
    });
}

function clearForms() {
    document.getElementById('loginFormElement').reset();
    document.getElementById('registerFormElement').reset();
    clearMessages();
}

// Profile and orders functionality (placeholder)
document.getElementById('profileBtn').addEventListener('click', function(e) {
    e.preventDefault();
    alert('Chức năng hồ sơ cá nhân đang được phát triển!');
    userDropdown.classList.remove('active');
});

document.getElementById('ordersBtn').addEventListener('click', function(e) {
    e.preventDefault();
    alert('Chức năng xem đơn hàng đang được phát triển!');
    userDropdown.classList.remove('active');
});

// Rest of the existing JavaScript code...
// Smooth scrolling cho navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Animation khi hover vào product cards
document.querySelectorAll('.product-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-10px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// Xử lý nút thêm vào giỏ hàng
let cartCount = 0;
document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', function() {
        if (!currentUser) {
            alert('Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng!');
            authModal.classList.add('active');
            showLoginForm();
            return;
        }

        cartCount++;
        this.textContent = 'Đã thêm ✓';
        this.style.background = '#27ae60';
        
        setTimeout(() => {
            this.textContent = 'Thêm vào giỏ';
            this.style.background = 'linear-gradient(135deg, #4CAF50, #2E8B57)';
        }, 2000);
        
        // Hiệu ứng bounce cho cart icon
        const cartIcon = document.querySelector('.cart-icon');
        cartIcon.style.animation = 'bounce 0.5s';
        setTimeout(() => {
            cartIcon.style.animation = '';
        }, 500);
    });
});

// Animation cho hero section
window.addEventListener('scroll', function() {
    const hero = document.querySelector('.hero');
    const scrolled = window.pageYOffset;
    const rate = scrolled * -0.5;
    hero.style.transform = `translateY(${rate}px)`;
});
