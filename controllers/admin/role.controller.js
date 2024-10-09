const Role = require('../../models/roles.model');
const mongoose = require('mongoose');


//[GET] /admin/roles
module.exports.index = async (req, res) => {
    const find = {
        deleted: false
    }
    const roles = await Role.find(find);
    res.render('admin/pages/roles/index', {
        pageTitle: 'Phân quyền',
        roles: roles
    });
}
//[GET] /admin/roles/create
module.exports.create = (req, res) => {
    res.render('admin/pages/roles/create', {
        pageTitle: 'Thêm mới quyền'
    });
}
//[POST] /admin/roles/create
module.exports.createPost = async (req, res) => {
    try {
        req.body._id = new mongoose.Types.ObjectId();
        await Role.create(req.body);
        req.flash('success', 'Thêm mới quyền thành công');
        res.redirect('/admin/roles');
    } catch (error) {
        req.flash('error', 'Thêm mới quyền thất bại');
        res.redirect('/admin/roles/create');
    }
}
//[GET] /admin/roles/edit/:id
module.exports.edit = async (req, res) => {
    const role = await Role.findById(req.params.id);
    res.render('admin/pages/roles/edit', {
        pageTitle: 'Chỉnh sửa quyền',
        role: role
    });
}
//[PATCH] /admin/roles/edit/:id
module.exports.editPatch = async (req, res) => {
    try {
        await Role.findByIdAndUpdate(req.params.id, req.body);
        req.flash('success', 'Chỉnh sửa quyền thành công');
        res.redirect('/admin/roles');
    }
    catch (error) {
        req.flash('error', 'Chỉnh sửa quyền thất bại');
        res.redirect('/admin/roles/edit/' + req.params.id);
    }
}
//[DELETE] /admin/roles/delete/:id
module.exports.delete = async (req, res) => {
    try {
        await Role.findByIdAndUpdate(req.params.id, { deleted: true });
        req.flash('success', 'Xóa quyền thành công');
        res.redirect('/admin/roles');
    }
    catch (error) {
        req.flash('error', 'Xóa quyền thất bại');
        res.redirect('/admin/roles');
    }
}
//[GET] /admin/roles/permissions
module.exports.permissions = async (req, res) => {
    let find = {
        deleted: false
    }
    let record = await Role.find(find);

    res.render('admin/pages/roles/permissions', {
        pageTitle: 'Phân quyền',
        roles: record
    });
}
//[PATCH] /admin/roles/permissions
module.exports.permissionsPatch = async (req, res) => {
    try {
        let permissions = JSON.parse(req.body.permissions);
        permissions.forEach(async permission => {
            await Role.findByIdAndUpdate(permission.id, { permissions: permission.permissions });
        });
        req.flash('success', 'Phân quyền thành công');
        res.redirect('/admin/roles/permissions');
    } catch (error) {
        req.flash('error', 'Phân quyền thất bại');
        res.redirect('/admin/roles/permissions');
    }
}
