const express = require('express');
const router = express.Router();
//upload file
const multer = require('multer');
const upload = multer();

const uploadCloud = require('../../middleware/admin/uploadCloud.middleware');



const controller = require('../../controllers/admin/product.controller');
const validate = require('../../validates/admin/product.validate');

router.get('/', controller.index);
router.patch('/changeStatus/:status/:id', controller.changeStatus);
router.patch('/change-multi', controller.changeMulti)
router.delete('/delete/:id', controller.delete)
router.delete('/delete-multi', controller.changeMulti)
router.patch('/change-position', controller.changeMulti)
router.get('/create', controller.create)
router.post('/create',
    upload.single('thumbnail'),
    uploadCloud.upload,
    validate.createPost,
    controller.createPost)
router.get('/edit/:id', controller.edit)
router.patch('/edit/:id',
    upload.single('thumbnail'),
    uploadCloud.upload,
    validate.editPatch,
    controller.editPatch)
router.get('/detail/:id', controller.detail)

module.exports = router;

