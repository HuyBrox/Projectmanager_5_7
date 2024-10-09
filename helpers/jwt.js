const jwt = require('jsonwebtoken');

// Secret key dùng để mã hóa và giải mã token
// ************sau này bạn có thể thay đổi nó bằng một chuỗi bí mật khác trong file .env
const secretKey = 'your_secret_key'; // Thay 'your_secret_key' bằng chuỗi bí mật của bạn

// Hàm tạo JWT
const generateToken = (payload, expiresIn = '1h') => {
    // Tạo token với thông tin payload và thời gian hết hạn
    return jwt.sign(payload, secretKey, { expiresIn });
};

// Hàm xác minh JWT
const verifyToken = (token) => {
    try {
        // Xác minh token và trả về thông tin đã mã hóa trong token nếu hợp lệ
        return jwt.verify(token, secretKey);
    } catch (error) {
        // Nếu token không hợp lệ, trả về null
        return null;
    }
};

// Hàm giải mã JWT (không cần xác minh)
const decodeToken = (token) => {
    return jwt.decode(token);
};

// Export các hàm để sử dụng ở nơi khác
module.exports = {
    generateToken,
    verifyToken,
    decodeToken
};
