const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username:{
        type : String,
        required: true,
        trim: true
    },

    email:{
        type : String,
        required: true,
        unique: true
    },

    mobile:{
        type : String,
        required: true,
        match : /^[6-9]\d{9}$/
    },

    address: {
        type : String,
        required: true,
    },

    password: {
        type : String,
        required: true
    },
    isAdmin: { 
        type: Boolean,
        default: false 
        },
},{timestamps:true});

const User = mongoose.model('User', userSchema);

module.exports = User;