const mongoose = require('mongoose');

//Tạo schema
const roleSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    title: String,
    description: String,
    permissions: {
        type: Array,
        default: []
    },
    deleted: {
        type: Boolean,
        default: false
    },
    deletedAt: Date
}, {
    timestamps: true
});
//tham số thứ nhất là tên model, tham số thứ 2 là schema, tham số thứ 3 là tên collection
const Role = mongoose.model('roles', roleSchema, "roles");

module.exports = Role;