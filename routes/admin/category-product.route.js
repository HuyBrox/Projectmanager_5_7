const express = require('express');
const router = express.Router();
//upload file
const multer = require('multer');
const upload = multer();
const uploadCloud = require('../../middleware/admin/uploadCloud.middleware');


const controller = require('../../controllers/admin/category-product.controller');
const validate = require('../../validates/admin/category-product.validate');

router.get('/', controller.index);
router.get('/create', controller.create);
router.post('/create',
    upload.single('thumbnail'),
    uploadCloud.upload,
    validate.createPost,
    controller.createPost
);
router.get('/detail/:id', controller.detail);
router.get('/edit/:id', controller.edit);
router.patch('/edit/:id',
    upload.single('thumbnail'),
    uploadCloud.upload,
    validate.editPatch,
    controller.editPatch
);

module.exports = router;