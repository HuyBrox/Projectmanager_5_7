const systemConfig = require('../../config/system');
const { verifyToken } = require('../../helpers/jwt');
const Account = require('../../models/account.model');
const Role = require('../../models/roles.model');

module.exports.requireAuth = async (req, res, next) => {
    if (!req.cookies.token) {
        req.flash('error', 'Bạn cần đăng nhập để truy cập!');
        res.clearCookie('token'); // Xoá cookie token nếu không tồn tại
        res.redirect(systemConfig.prefixAdmin + '/auth/login');
        return;
    }

    // Kiểm tra token có hợp lệ không
    const token = req.cookies.token;
    const decode = verifyToken(token);

    // Nếu token không hợp lệ hoặc hết hạn
    if (!decode) {
        req.flash('error', 'Bạn cần đăng nhập để tiếp tục.');
        res.clearCookie('token'); // Xoá cookie token nếu không hợp lệ
        res.redirect(systemConfig.prefixAdmin + '/auth/login');
        return;
    }

    // Tìm user dựa trên email từ token
    try {
        const user = await Account.findOne({ email: decode.email, deleted: false })
            .select('-password -token'); // Không trả về mật khẩu và token
        console.log(user);
        // Nếu không tìm thấy user
        if (!user) {
            req.flash('error', 'Tài khoản không tồn tại.');
            res.clearCookie('token'); // Xoá token nếu không tìm thấy user
            res.redirect(systemConfig.prefixAdmin + '/auth/login');
            return;
        }
        const role = await Role.findOne({ _id: user.role_id }).select('title permissions').lean().exec();

        // Đặt user vào biến toàn cục để sử dụng trong các middleware khác
        res.locals.user = user;
        res.locals.role = role;
        next(); // Chuyển sang middleware tiếp theo

    } catch (err) {
        req.flash('error', 'Lỗi kết nối cơ sở dữ liệu.');
        res.clearCookie('token'); // Xoá cookie nếu xảy ra lỗi
        res.redirect(systemConfig.prefixAdmin + '/auth/login');
        return;
    }
};
