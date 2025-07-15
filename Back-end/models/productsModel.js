const mongoose = require('mongoose');

const productsSchhema = mongoose.Schema({
    title: String,
    price: Number,
    image: String,
    description: String,
    category: String,
    gender: String,
    brand: String,
    material: String,
    active : {
        type : Boolean,
        default : true
    }
});

const Product = mongoose.model('Product', productsSchhema);

module.exports = Product;
