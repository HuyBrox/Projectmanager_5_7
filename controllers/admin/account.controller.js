const mongoose = require('mongoose');
const Account = require('../../models/account.model');
const Roles = require('../../models/roles.model');
const { hashPassword } = require('../../helpers/hashPassword');
// index
module.exports.index = async (req, res) => {
    const find = {
        deleted: false
    };
    const record = await Account.find(find);

    res.render('admin/pages/account/index', {
        pageTitle: 'Tài khoản',
        accounts: record
    });
}
//create
module.exports.create = async (req, res) => {
    find = {
        deleted: false
    };
    const roles = await Roles.find(find);
    res.render('admin/pages/account/create', {
        pageTitle: 'Tạo tài khoản',
        roles: roles
    });
}
module.exports.createPost = async (req, res) => {
    try {
        req.body._id = new mongoose.Types.ObjectId();
        const checkEmail = await Account.findOne({
            email: req.body.email,
            deleted: false
        });
        if (checkEmail) {
            req.flash('error', 'Email đã tồn tại!');
            res.redirect('back');
            return;
        }
        req.body.password = hashPassword(req.body.password);
        await Account.create(req.body);
        req.flash('success', 'Tạo tài khoản thành công!');
        res.redirect('back');
    } catch (error) {
        req.flash('error', 'Tạo tài khoản thất bại!');
        res.redirect('/admin/accounts');
    }
}
