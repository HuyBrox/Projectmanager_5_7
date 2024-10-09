module.exports.createPost = (req, res, next) => {
    if (!req.body.title) {
        req.flash('error', 'Vui lòng nhập tên sản phẩm!');
        res.redirect('back');
        return;
    }
    if (req.body.thumbnail === undefined || req.body.thumbnail === '') {
        req.body.thumbnail = 'https://th.bing.com/th/id/OIP.r4eciF-FM2-3WdhvxTmGEgAAAA?rs=1&pid=ImgDetMain';
    }
    next();
}
// [PATCH] edit/:id
module.exports.editPatch = (req, res, next) => {
    if (!req.body.title) {
        req.flash('error', 'Vui lòng nhập tên danh mục!');
        res.redirect('back');
        return;
    }
    if (req.body.parent_id == req.body._id) {
        req.flash('error', 'Danh mục cha không thể là chính nó');
        return res.redirect(`${config.prefixAdmin}/category-product/edit/${id}`);
    }
    next();
};
