
//tách controller, index là tên hàm (ở đây là trang chủ nên đặt index);
module.exports.index = async (req, res) => {

    res.render("client/pages/home/index", {
        pagesTitle: "Trang chủ",
        // productCategory: newProductCategory
    })
}