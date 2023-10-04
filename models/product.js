const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'product name required'],
  },
  price: {
    type: Number,
    required: [true, 'product price required'],
  },
  featured: {
    type: Boolean,
    default: false,
  },
  rating: {
    type: Number,
    default: 4.5,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  company: {
    type: String,
    // enum: ['ikea', 'liddy', 'caressa', 'marcos'],
    enum: {
      values: ['ikea', 'liddy', 'caressa', 'marcos'],
      message: '{VALUE} does not exist',
    },
  },
});

module.exports = mongoose.model('Product', productSchema);
