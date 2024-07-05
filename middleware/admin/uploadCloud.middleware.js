const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');
// const storage = require('../../helpers/storageMulter');
// const upload = multer({ storage: storage(multer) });
//upload file
const multer = require('multer');
const upload = multer();

//cấu hình cloudinary
cloudinary.config({
    cloud_name: 'dtahyhx0h',
    api_key: '339816681182286',
    api_secret: 'vl3XS8xAaqIM5Nn35pfnRSO6PkA'
});

module.exports.upload = (req, res, next) => {
    let streamUpload = (req) => {
        return new Promise((resolve, reject) => {
            let stream = cloudinary.uploader.upload_stream((error, result) => {
                if (result) {
                    resolve(result);
                } else {
                    reject(error);
                }
            }
            );
            streamifier.createReadStream(req.file.buffer).pipe(stream);
        });
    };
    async function upload(req) {
        let result = await streamUpload(req);
        if (req.file) {
            //req.file.fieldname cũng giống như truyền vào hàm 'thumbnail'
            req.body[req.file.fieldname] = result.url;
        } else {
            req.body.thumbnail = 'https://img4.thuthuatphanmem.vn/uploads/2020/05/07/hinh-anh-cute-dep-nhat_093404024.jpg'; // Đặt giá trị mặc định nếu không có file
        }
        next();
    };
    upload(req);
}