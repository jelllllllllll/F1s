const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderNumber: String,
  customer: {
    email: String,
    phone: String,
    fullName: String,
    address: String,
    city: String,
    zip: String,
    state: String,
    country: String
  },
  items: Array,
  paymentMethod: String,
  shippingMethod: String,
  totalAmount: Number,
  status: { type: String, default: 'Pending' },
  orderDate: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema);