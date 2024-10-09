const Products = require('../../models/product.model')
const ProductCategory = require('../../models/category-product.model')
const config = require('../../config/system.js')
const filterStatusHelper = require('../../helpers/filterStatus')
const searchHelper = require('../../helpers/search')
const pageHelper = require('../../helpers/pagination')
const mongoose = require('mongoose');
const createTree = require('../../helpers/createTree.js')
const CategoryProduct = require('../../models/category-product.model')
//phải export ra tên hàm"lưu ý chỗ này"
//[GET]
module.exports.index = async (req, res) => {
    //Đoạn bộ lọc status
    const filterStatus = filterStatusHelper(req.query);
    const search = searchHelper(req.query);
    //find
    let find = {
        deleted: false
    };
    //lọc theo trạng thái hoạt động
    if (req.query.status) {
        find.status = req.query.status;
    }
    //tìm kiếm theo tên sản phẩm
    if (req.query.search) {
        find.title = search.a;
    } else {
        delete req.query.search;
    }
    //Phân trang
    const countProduct = await Products.countDocuments(find);
    let objectPagination = pageHelper({
        limitItem: 6,
        currentPage: 1
    },
        req.query,
        countProduct);
    // console.log(objectPagination.skip)
    //sort
    let sort = {};
    if (req.query.sortKey && req.query.sortValue) {
        sort[req.query.sortKey] = req.query.sortValue;
    } else {
        sort.position = "desc";
    }
    const products = await Products
        .find(find)
        .sort(sort)
        .limit(objectPagination.limitItem)
        .skip(objectPagination.skip);
    const productCategory = await ProductCategory.find({ deleted: false });
    res.render('admin/pages/product/index', {
        pageTitle: 'Product',
        products: products,
        filterStatus: filterStatus,
        search: search.b,
        pageObject: objectPagination,
        categoryProducts: productCategory
    });
}
//[PATCH]
module.exports.changeStatus = async (req, res) => {
    const updateBy = {
        accountId: res.locals.user._id,
        updatedAt: new Date()
    }
    console.log(req.params);
    const Status = req.params.status;
    const id = req.params.id;
    await Products.findByIdAndUpdate(id, {
        status: Status,
        $push: {
            updatedBy: updateBy
        }
    });
    console.log('update ::: ' + await Products.findById(id).updatedBy);
    req.flash('success', 'Đã sửa trạng thái sản phẩm thành công');
    res.redirect('back');
}
//[PATCH]
module.exports.changeMulti = async (req, res) => {
    const updateBy = {
        accountId: res.locals.user._id,
        updatedAt: new Date()
    }
    const type = req.body.type;
    const ids = req.body.ids.split(", ");
    switch (type) {
        case 'Active':
            await Products.updateMany({ _id: { $in: ids } }, {
                status: "Active",
                $push: {
                    updatedBy: updateBy
                }
            });
            req.flash('success', `Đã sửa trạng thái ${ids.length} sản phẩm thành công`);
            res.redirect('back');
            break;
        case 'Inactive':
            await Products.updateMany({ _id: { $in: ids } }, {
                status: "Inactive",
                $push: {
                    updatedBy: updateBy
                }
            });
            req.flash('success', `Đã sửa trạng thái ${ids.length} sản phẩm thành công`);
            res.redirect('back');
            break;
        case 'ChangeManyPosition':
            for (const item of ids) {
                let [id, position] = item.split("-");
                position = parseInt(position);
                await Products.updateOne({ _id: { $in: id } }, {
                    position: position,
                    $push: {
                        updatedBy: updateBy
                    }
                });
            }
            req.flash('success', `Đã sửa vị trí ${ids.length} sản phẩm thành công`);
            res.redirect('back');
            break;
        case 'DeleteManyItem':
            await Products.updateMany({ _id: { $in: ids } }, {
                deleted: true,
                deletedAt: new Date()
            });
            req.flash('success', `Đã xóa ${ids.length} sản phẩm thành công`);
            res.redirect('back');
            break;

        default:
            break;
    }
}
//[DELETE]
module.exports.delete = async (req, res) => {
    id = req.params.id;
    await Products.updateOne({ _id: id }, {
        deletedAt: new Date(),
        deleted: true
    })
    res.redirect('back')
}
//[GET] /create
module.exports.create = async (req, res) => {
    let find = {
        deleted: false
    };
    const productCategory = await ProductCategory.find(find);
    const newProductCategory = createTree(productCategory);
    res.render('admin/pages/product/create', {
        pageTitle: 'Thêm sản phẩm',
        categoryProducts: newProductCategory
    });
}
//[POST] /create
module.exports.createPost = async (req, res) => {
    try {
        req.body._id = new mongoose.Types.ObjectId();
        req.body.price = parseInt(req.body.price);
        req.body.discountPercentage = parseInt(req.body.discountPercentage);
        req.body.stock = parseInt(req.body.stock);
        if (req.body.position == '') {
            const countProduct = await Products.countDocuments();
            req.body.position = countProduct + 1;
        } else {
            req.body.position = parseInt(req.body.position);
        }
        req.body.createdBy = {
            accountId: res.locals.user._id
        }
        const product = new Products(req.body);
        await product.save();
        res.redirect(`${config.prefixAdmin}/product`);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
};

//[GET] /edit/:id
module.exports.edit = async (req, res) => {


    console.log(req.params.id);
    const find = {
        _id: req.params.id,
        deleted: false
    };
    const product = await Products.findOne(find);

    const productCategory = await ProductCategory.find({ deleted: false });
    const newProductCategory = createTree(productCategory);

    res.render('admin/pages/product/edit', {
        pageTitle: 'Sửa sản phẩm',
        product: product,
        categoryProducts: newProductCategory
    });
}
//[PATCH] /edit/:id
module.exports.editPatch = async (req, res) => {
    console.log(req.body);

    try {

        const updateBy = {
            accountId: res.locals.user._id,
            updatedAt: new Date()
        }
        const id = req.params.id;
        const old_thumbnail = Products.findOne({ _id: id }).thumbnail;
        if (!req.file) {
            req.body.thumbnail = old_thumbnail;
        }
        // if (req.file) {
        //     req.body.thumbnail = `/uploads/${req.file.filename}`;
        // }
        req.body.price = parseInt(req.body.price);
        req.body.discountPercentage = parseInt(req.body.discountPercentage);
        req.body.stock = parseInt(req.body.stock);
        await Products.updateOne({ _id: id }, {
            ...req.body, //lấy tất cả thông tin từ body
            //... là toán tử spread
            $push: {
                updatedBy: updateBy
            }
        });
        req.flash('success', 'Sửa sản phẩm thành công');
        res.redirect(`${config.prefixAdmin}/product`);
    } catch (error) {
        console.error(error);
        req.flash('error', 'Sửa sản phẩm thất bại');
    }
}
// [GET] / detail /: id
module.exports.detail = async (req, res) => {
    const find = {
        _id: req.params.id,
        deleted: false
    };
    console.log(find);
    const product = await Products.findOne(find);
    res.render('admin/pages/product/detail', {
        pageTitle: 'Chi tiết sản phẩm',
        product: product
    });
}


