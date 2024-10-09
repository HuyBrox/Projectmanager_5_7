const mongoose = require('mongoose');
const Account = require('../../models/account.model');
const config = require('../../config/system.js')
const { hashPassword, comparePassword } = require('../../helpers/hashPassword');
const { generateToken, verifyToken, decodeToken } = require("../../helpers/jwt");
const e = require('express');


module.exports.login = async (req, res) => {
    if (req.cookies.token) {
        const decode = decodeToken(req.cookies.token);
        if (decode) {
            req.flash('success', 'Bạn đã đăng nhập! ');
            res.redirect('/admin/dashboard');
            return;
        }
    } else {
        res.render('admin/pages/auth/loginAndSigin', {
            pageTitle: 'Đăng nhập'
        });
    }

}
module.exports.postLogin = async (req, res) => {
    const { email, password } = req.body;
    const find = {
        email: email,
        deleted: false
    }
    const account = await Account.findOne(find);
    if (!account) {
        req.flash('error', 'Emmail không tồn tại! ');
        res.redirect('back');
        return;
    }
    // console.log(account.password);
    // console.log(comparePassword(password, account.password)); // Sử dụng hàm này để so sánh mật khẩu

    if (!comparePassword(password, account.password)) {
        req.flash('error', 'Mật khẩu không đúng!');
        res.redirect('back');
        return;
    }
    if (account.status !== '1') {
        req.flash('error', 'Tài khoản của bạn đã bị khóa! ');
        res.redirect('back');
        return;
    }
    // Tạo token và gửi về cho client
    const token = generateToken({ _id: account._id, email: account.email }, '1h');
    res.cookie('token', token, { maxAge: 3600000 });

    req.flash('success', 'Đăng nhập thành công! ');
    res.redirect('/admin/dashboard');
}
//logout
module.exports.logout = async (req, res) => {
    res.clearCookie('token');
    req.flash('success', 'Đăng xuất thành công! ');
    res.redirect('/admin/auth/login');
}
