const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.ObjectId,
    ref: 'Product',
    required: [true, 'Booking must belongs to a Product!'],
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Booking must belongs to a user!'],
  },
  price: {
    type: Number,
    required: [true, 'Booking Must have Price'],
  },
  slug: {
    type: String,
    required: [true, 'booking Must have slug'],
  },
  address: {
    type: String,
    required: [true, 'booking Must have address'],
  },
  phone: {
    type: Number,
    required: [true, 'booking Must have phone number'],
  },
  email: {
    type: String,
    required: [true, 'booking Must have email id'],
  },
  productName: {
    type: String,
    required: [true, 'booking Must have product name'],
  },
  userName: {
    type: String,
    required: [true, 'booking Must have user name'],
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  paid: {
    type: Boolean,
    default: true,
  },
});

bookingSchema.pre(/^find/, function (next) {
  this.populate('user').populate({
    path: 'product',
    select: 'name',
  });
  next();
});

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;
