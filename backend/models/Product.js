const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  id: String,
  title: String,
  vendor_type: String,
  team: String,
  creator_name: String,
  price: Number,
  currency: String,
  images: [String],
  variants: Array,
  stock_total: Number,
  description: String,
  badges: [String],
  category: String,
  sku: String,
  royalty_percent: Number
});

module.exports = mongoose.model('Product', productSchema);