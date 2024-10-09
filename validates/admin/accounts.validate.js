module.exports.createPost = (req, res, next) => {
    if (!req.body.fullName) {
        req.flash('error', 'Vui lòng nhập tên tài khoản!');
        res.redirect('./create');
        return;
    }
    if (!req.body.email) {
        req.flash('error', 'Vui lòng nhập email!');
        res.redirect('back');
        return;
    }
    if (!req.body.password) {
        req.flash('error', 'Vui lòng nhập mật khẩu!');
        res.redirect('back');
        return;
    }
    if (req.body.avatar === undefined || req.body.avatar === '') {
        req.body.avatar = 'https://th.bing.com/th/id/OIP.r4eciF-FM2-3WdhvxTmGEgAAAA?rs=1&pid=ImgDetMain';
    }
    if (!req.body.role_id) {
        req.flash('error', 'Vui lòng chọn quyền!');
        res.redirect('back');
        return;
    }
    next();
}