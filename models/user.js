const mongoose = require('mongoose');
const { applyTimestamps } = require('./event');


const usershema = mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, default: false },
},{
Timestamps : true
});

const Usermodel = mongoose.model('user', usershema, 'user');

module.exports = Usermodel;