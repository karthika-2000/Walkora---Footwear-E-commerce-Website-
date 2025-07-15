const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  label: {
    type: String, // e.g., "Men's Casual Shoes"
    required: true
  },
  image: {
    type: String, // Path like "images/whitemodelshoe.avif"
    required: true
  },
  borderColor: {
    type: String, // e.g., "black" or "#ff8008"
    required: true
  }
});

const Category = mongoose.model('category', categorySchema);
module.exports = Category;
