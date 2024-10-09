const mongoose = require('mongoose');
//import jwt
const jwt = require("../helpers/jwt.js");

//Tạo schema
const accountSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    fullName: String,
    email: String,
    password: String,
    role_id: String,
    status: String,
    avatar: String,
    phone: String,
    token: {
        type: String,
        default: null
    },
    deleted: {
        type: Boolean,
        default: false
    },
    deletedAt: Date
}, {
    timestamps: true
});

// Middleware để tạo token sau khi tài liệu được lưu
accountSchema.pre('save', function (next) {
    if (!this.token) {
        this.token = `Bearer ${jwt.generateToken({ email: this.email }, '1h')}`;
    }
    next();
});

//tham số thứ nhất là tên model, tham số thứ 2 là schema, tham số thứ 3 là tên collection
const Account = mongoose.model('Account', accountSchema, "accounts");

module.exports = Account;
