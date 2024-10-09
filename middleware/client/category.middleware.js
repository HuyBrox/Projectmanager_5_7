const Products = require("../../models/product.model");
const ProductCategory = require("../../models/category-product.model");
const createTree = require("../../helpers/createTree");

module.exports.category = async (req, res, next) => {
    const find = {
        deleted: false
    };
    const productCategory = await ProductCategory.find(find);
    const newProductCategory = createTree(productCategory);
    res.locals.productCategory = newProductCategory;
    next();
}