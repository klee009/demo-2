// SignUp.js - JavaScript cho trang đăng ký

document.addEventListener('DOMContentLoaded', function() {
    const signUpForm = document.querySelector('form');
    
    // Khởi tạo danh sách tài khoản đã đăng ký trong memory
    if (!window.registeredUsers) {
        window.registeredUsers = [];
    }
    
    signUpForm.addEventListener('submit', function(e) {
        e.preventDefault(); // Ngăn form submit mặc định
        
        // Lấy giá trị từ form
        const username = document.getElementById('tdn').value.trim();
        const password = document.getElementById('mk').value;
        const confirmPassword = document.getElementById('nlmk').value;
        const email = document.getElementById('gmail').value.trim();
        const phone = document.getElementById('sdt').value.trim();
        
        // Reset trạng thái input
        resetInputStyles();
        
        // Validation
        if (!validateSignUpForm(username, password, confirmPassword, email, phone)) {
            return;
        }
        
        // Kiểm tra tài khoản đã tồn tại
        if (isUserExists(username, email)) {
            showMessage('Tên đăng nhập hoặc email đã được sử dụng!', 'error');
            return;
        }
        
        // Tạo tài khoản mới
        const newUser = {
            username: username,
            password: password,
            email: email,
            phone: phone,
            registrationDate: new Date().toISOString()
        };
        
        // Lưu vào danh sách tài khoản
        window.registeredUsers.push(newUser);
        
        // Hiển thị thông báo thành công
        showMessage('Đăng ký thành công! Đang chuyển đến trang đăng nhập...', 'success');
        
        // Reset form
        signUpForm.reset();
        
        // Chuyển đến trang đăng nhập sau 2 giây
        setTimeout(() => {
            window.location.href = 'SignIn.html';
        }, 2000);
    });
    
    // Real-time validation
    setupRealTimeValidation();
});

// Hàm validation form đăng ký
function validateSignUpForm(username, password, confirmPassword, email, phone) {
    let isValid = true;
    
    // Kiểm tra tên đăng nhập
    if (!username || username.length < 3) {
        markInputAsError('tdn', 'Tên đăng nhập phải có ít nhất 3 ký tự');
        isValid = false;
    } else if (!/^[a-zA-Z0-9_]+$/.test(username)) {
        markInputAsError('tdn', 'Tên đăng nhập chỉ được chứa chữ cái, số và dấu gạch dưới');
        isValid = false;
    }
    
    // Kiểm tra mật khẩu
    if (!password || password.length < 6) {
        markInputAsError('mk', 'Mật khẩu phải có ít nhất 6 ký tự');
        isValid = false;
    }
    
    // Kiểm tra xác nhận mật khẩu
    if (!confirmPassword || password !== confirmPassword) {
        markInputAsError('nlmk', 'Mật khẩu xác nhận không khớp');
        isValid = false;
    }
    
    // Kiểm tra email
    if (!email || !isValidEmail(email)) {
        markInputAsError('gmail', 'Email không hợp lệ');
        isValid = false;
    }
    
    // Kiểm tra số điện thoại (tùy chọn)
    if (phone && !isValidPhone(phone)) {
        markInputAsError('sdt', 'Số điện thoại không hợp lệ');
        isValid = false;
    }
    
    if (!isValid) {
        showMessage('Vui lòng kiểm tra lại thông tin đăng ký!', 'error');
    }
    
    return isValid;
}

// Hàm kiểm tra email hợp lệ
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Hàm kiểm tra số điện thoại hợp lệ
function isValidPhone(phone) {
    const phoneRegex = /^(\+84|0)[0-9]{9,10}$/;
    return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
}

// Hàm kiểm tra tài khoản đã tồn tại
function isUserExists(username, email) {
    const registeredUsers = window.registeredUsers || [];
    return registeredUsers.some(user => 
        user.username === username || user.email === email
    );
}

// Hàm đánh dấu input lỗi
function markInputAsError(inputId, message) {
    const input = document.getElementById(inputId);
    input.classList.add('input-error');
    
    // Tạo hoặc cập nhật thông báo lỗi
    let errorMsg = input.parentNode.querySelector('.error-message');
    if (!errorMsg) {
        errorMsg = document.createElement('span');
        errorMsg.className = 'error-message';
        errorMsg.style.cssText = 'color: #f44336; font-size: 12px; display: block; margin-top: 5px;';
        input.parentNode.appendChild(errorMsg);
    }
    errorMsg.textContent = message;
}

// Hàm đánh dấu input thành công
function markInputAsSuccess(inputId) {
    const input = document.getElementById(inputId);
    input.classList.remove('input-error');
    input.classList.add('input-success');
    
    // Xóa thông báo lỗi
    const errorMsg = input.parentNode.querySelector('.error-message');
    if (errorMsg) {
        errorMsg.remove();
    }
}

// Hàm reset trạng thái input
function resetInputStyles() {
    const inputs = document.querySelectorAll('input');
    inputs.forEach(input => {
        input.classList.remove('input-error', 'input-success');
    });
    
    // Xóa tất cả thông báo lỗi
    const errorMessages = document.querySelectorAll('.error-message');
    errorMessages.forEach(msg => msg.remove());
}

// Hàm thiết lập validation theo thời gian thực
function setupRealTimeValidation() {
    const inputs = document.querySelectorAll('input');
    
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            const inputId = this.id;
            const value = this.value.trim();
            
            switch(inputId) {
                case 'tdn':
                    if (value && value.length >= 3 && /^[a-zA-Z0-9_]+$/.test(value)) {
                        if (!isUserExists(value, '')) {
                            markInputAsSuccess(inputId);
                        } else {
                            markInputAsError(inputId, 'Tên đăng nhập đã được sử dụng');
                        }
                    }
                    break;
                case 'mk':
                    if (value && value.length >= 6) {
                        markInputAsSuccess(inputId);
                    }
                    break;
                case 'nlmk':
                    const password = document.getElementById('mk').value;
                    if (value && value === password) {
                        markInputAsSuccess(inputId);
                    }
                    break;
                case 'gmail':
                    if (value && isValidEmail(value)) {
                        if (!isUserExists('', value)) {
                            markInputAsSuccess(inputId);
                        } else {
                            markInputAsError(inputId, 'Email đã được sử dụng');
                        }
                    }
                    break;
                case 'sdt':
                    if (!value || isValidPhone(value)) {
                        markInputAsSuccess(inputId);
                    }
                    break;
            }
        });
    });
}

// Hàm hiển thị thông báo (giống SignIn.js)
function showMessage(message, type) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    messageDiv.textContent = message;
    
    messageDiv.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        padding: 15px 30px;
        border-radius: 5px;
        color: white;
        font-weight: bold;
        z-index: 1000;
        opacity: 0;
        transition: opacity 0.3s ease;
        ${type === 'success' ? 'background-color: #4CAF50;' : 'background-color: #f44336;'}
    `;
    
    document.body.appendChild(messageDiv);
    
    setTimeout(() => {
        messageDiv.style.opacity = '1';
    }, 100);
    
    setTimeout(() => {
        messageDiv.style.opacity = '0';
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.parentNode.removeChild(messageDiv);
            }
        }, 300);
    }, 3000);
}

// Thêm CSS cho form validation
const style = document.createElement('style');
style.textContent = `
    .input-error {
        border: 2px solid #f44336 !important;
        background-color: #ffebee !important;
    }
    
    .input-success {
        border: 2px solid #4CAF50 !important;
        background-color: #e8f5e8 !important;
    }
    
    .form-loading {
        opacity: 0.7;
        pointer-events: none;
    }
    
    .error-message {
        animation: fadeIn 0.3s ease;
    }
    
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
`;
document.head.appendChild(style);