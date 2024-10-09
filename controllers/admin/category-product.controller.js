const CategoryProduct = require('../../models/category-product.model.js');
const config = require('../../config/system.js')
const mongoose = require('mongoose');
const pageHelper = require('../../helpers/pagination')
const createTree = require('../../helpers/createTree')
// [GET]
module.exports.index = async (req, res) => {
    const find = {
        deleted: false
    };
    function createTree(arr, parent_id = "") {
        const tree = [];
        arr.forEach(item => {
            if (item.parent_id == parent_id) {
                const newItem = item;
                const children = createTree(arr, item._id);
                if (children.length > 0) {
                    newItem.children = children;
                }
                tree.push(newItem);
            }
        });
        return tree;
    }
    const record = await CategoryProduct.find(find);
    const newRecord = createTree(record);

    res.render('admin/pages/category-product/index', {
        pageTitle: 'Danh mục sản phẩm',
        newRecord: newRecord
    });
}
//[GET] /create
module.exports.create = async (req, res) => {
    let find = {
        deleted: false
    }
    const record = await CategoryProduct.find(find);
    const newRecord = createTree(record);

    res.render('admin/pages/category-product/create', {
        pageTitle: 'Thêm danh mục sản phẩm',
        categories: record,
        newRecord: newRecord
    });
}
//[POST] /create
module.exports.createPost = async (req, res) => {
    try {
        if (req.body.position == '') {
            const count = await CategoryProduct.countDocuments();
            req.body.position = count + 1;
        } else {
            req.body.position = parseInt(req.body.position);
        }
        req.body._id = new mongoose.Types.ObjectId();
        const categoryProduct = new CategoryProduct(req.body);
        await categoryProduct.save();
        req.flash('success', 'Thêm danh mục sản phẩm thành công');
    } catch (error) {
        req.flash('error', 'Thêm danh mục sản phẩm thất bại');
    }
    res.redirect(`${config.prefixAdmin}/category-product`);
};
//[GET] /detail/:id
module.exports.detail = async (req, res) => {
    const id = req.params.id;
    const record = await CategoryProduct.findOne({ _id: id });
    res.render('admin/pages/category-product/detail', {
        pageTitle: 'Chi tiết danh mục ',
        record: record
    });
}
//[GET] /edit/:id
module.exports.edit = async (req, res) => {
    const id = req.params.id;
    const record = await CategoryProduct.findOne({ _id: id });

    let find = {
        deleted: false
    }
    const categories = await CategoryProduct.find(find);
    const newCategories = createTree(categories);
    res.render('admin/pages/category-product/edit', {
        pageTitle: 'Chính sửa danh mục',
        record: record,
        newCategories: newCategories
    });
}
//[PATCH] /edit/:id
module.exports.editPatch = async (req, res) => {
    const id = req.params.id;
    try {
        if (req.body.position == '') {
            const count = await CategoryProduct.countDocuments();
            req.body.position = count + 1;
        } else {
            req.body.position = parseInt(req.body.position);
        }

        await CategoryProduct.updateOne({ _id: id }, req.body);
        req.flash('success', 'Chỉnh sửa danh mục sản phẩm thành công');
    } catch (error) {
        req.flash('error', 'Chỉnh sửa danh mục sản phẩm thất bại');
    }
    res.redirect('back');
}