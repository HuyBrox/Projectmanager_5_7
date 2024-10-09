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
        req.flash('error', 'Vui lòng nhập tên sản phẩm!');
        res.redirect('back');
        return;
    }

    next();
};
