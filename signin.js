// SignIn.js - JavaScript cho trang đăng nhập

document.addEventListener('DOMContentLoaded', function() {
    const signInForm = document.querySelector('form');
    
    signInForm.addEventListener('submit', function(e) {
        e.preventDefault(); // Ngăn form submit mặc định
        
        // Lấy giá trị từ form
        const username = document.getElementById('tdn').value.trim();
        const password = document.getElementById('mk').value;
        
        // Validation cơ bản
        if (!username || !password) {
            showMessage('Vui lòng điền đầy đủ thông tin!', 'error');
            return;
        }
        
        // Kiểm tra thông tin đăng nhập (ví dụ với tài khoản mặc định)
        if (validateLogin(username, password)) {
            showMessage('Đăng nhập thành công!', 'success');
            
            // Lưu thông tin đăng nhập vào memory (thay thế localStorage)
            window.currentUser = {
                username: username,
                loginTime: new Date().toISOString()
            };
            
            // Chuyển hướng sau 2 giây
            setTimeout(() => {
                window.location.href = 'TrangChu.html';
            }, 2000);
            
        } else {
            showMessage('Tên đăng nhập hoặc mật khẩu không đúng!', 'error');
        }
    });
});

// Hàm kiểm tra thông tin đăng nhập
function validateLogin(username, password) {
    // Lấy danh sách tài khoản đã đăng ký từ memory
    const registeredUsers = window.registeredUsers || [];
    
    // Tài khoản mặc định
    const defaultUsers = [
        { username: 'admin', password: 'admin123' },
        { username: 'user', password: 'user123' }
    ];
    
    // Kiểm tra trong danh sách đã đăng ký
    const foundUser = registeredUsers.find(user => 
        user.username === username && user.password === password
    );
    
    // Kiểm tra tài khoản mặc định
    const foundDefaultUser = defaultUsers.find(user => 
        user.username === username && user.password === password
    );
    
    return foundUser || foundDefaultUser;
}

// Hàm hiển thị thông báo
function showMessage(message, type) {
    // Tạo element thông báo
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    messageDiv.textContent = message;
    
    // Style cho thông báo
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
    
    // Thêm vào body
    document.body.appendChild(messageDiv);
    
    // Hiển thị với animation
    setTimeout(() => {
        messageDiv.style.opacity = '1';
    }, 100);
    
    // Tự động ẩn sau 3 giây
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
`;
document.head.appendChild(style);