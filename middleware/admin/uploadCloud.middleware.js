const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');

// Cấu hình cloudinary
cloudinary.config({
    cloud_name: 'dtahyhx0h',
    api_key: '339816681182286',
    api_secret: 'vl3XS8xAaqIM5Nn35pfnRSO6PkA'
});

module.exports.upload = (req, res, next) => {
    let streamUpload = (req) => {
        return new Promise((resolve, reject) => {
            if (!req.file || !req.file.buffer) {
                resolve(null); // Không có file để upload
                return;
            }

            let stream = cloudinary.uploader.upload_stream((error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(result);
                }
            });
            streamifier.createReadStream(req.file.buffer).pipe(stream);
        });
    };

    async function upload(req) {
        try {
            let result = await streamUpload(req);
            if (result) {
                req.body[req.file.fieldname] = result.url;
            }
            next();
        } catch (error) {
            console.error('Lỗi khi tải lên file:', error);
            res.redirect('back');
        }
    }

    upload(req);
};
