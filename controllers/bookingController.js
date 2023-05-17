// eslint-disable-next-line import/no-extraneous-dependencies
// const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
// const Stripe = require('stripe');
// require('dotenv').config();

// const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
const stripe = require('stripe')(
  ' sk_test_51MderHSJQWZqP5L8dWnkw45l5N9bAal1kOv6D9zcBkLAajaJHMu3q2kQf28vMWSqGhqeKXrkp8rvKzN9XNruq8h800L5vkDTVJ'
);
const Booking = require('./../models/bookingModel');
const Product = require('../models/productModel');
const catchAsync = require('../utils/catchAsync');
// const AppError = require('./../utils/appError');
const factory = require('./handlerFactory');

exports.getCheckoutSession = catchAsync(async (req, res, next) => {
  //1)get currently booked products
  const product = await Product.findById(req.params.productID);
  console.log(product);
  // 2) Create checkout session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    mode: 'payment', // Add payment mode here
    success_url: `${req.protocol}://${req.get('host')}/?product=${
      req.params.productID
    }&user=${req.user.id}&price=${product.price}&slug=${product.slug}&address=${
      req.user.address
    }&phone=${req.user.phone}&email=${req.user.email}&productName=${
      product.name
    }&userName=${req.user.name}`,
    cancel_url: `${req.protocol}://${req.get('host')}/product/${product.slug}`,
    customer_email: req.user.email,
    client_reference_id: req.params.productID,
    line_items: [
      {
        price_data: {
          currency: 'INR',
          product_data: {
            name: `${product.name} Product`,
            description: product.summary,
            images: [
              `http://127.0.0.1:3000/public/img/product/${product.imageCover}`,
            ],
          },
          unit_amount: product.price * 100,
        },
        adjustable_quantity: { enabled: true, minimum: 1, maximum: 20 },
        quantity: 1,
      },
    ],
  });
  //3) create session as response
  console.log(session);
  res.status(200).json({
    status: 'success',
    session,
  });
});

exports.createBookingCheckout = catchAsync(async (req, res, next) => {
  const {
    product,
    user,
    price,
    slug,
    address,
    phone,
    email,
    productName,
    userName,
  } = req.query;
  if (
    !product &&
    !user &&
    !price &&
    !slug &&
    !address &&
    !phone &&
    !email &&
    !productName &&
    !userName
  )
    return next();
  await Booking.create({
    product,
    user,
    price,
    slug,
    address,
    phone,
    email,
    productName,
    userName,
  });

  //it will generate  a new request on what url we are providing here
  const RedirectUrlTo = `${req.protocol}://${req.get('host')}/productDelivery`;
  res.redirect(RedirectUrlTo);
});

exports.createBooking = factory.createOne(Booking);
exports.getBooking = factory.getOne(Booking);
exports.getAllBooking = factory.getAll(Booking);
exports.updateBooking = factory.updateOne(Booking);
exports.deleteBooking = factory.deleteOne(Booking);
