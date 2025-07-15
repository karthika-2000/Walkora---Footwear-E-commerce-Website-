const mongoose = require('mongoose');

const collectionSchema = new mongoose.Schema({

  gender: {
    type: String, 
    required: true,
    unique : true
  },
    image: {
    type: String,
    required: true
  },
  tagline: {
    type: String, 
    required: true
  }
});

const Collection = mongoose.model('collection', collectionSchema);
module.exports = Collection;
