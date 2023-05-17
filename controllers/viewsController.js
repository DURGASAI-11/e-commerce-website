const Product = require('../models/productModel');
const User = require('../models/userModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const Booking = require('../models/bookingModel');

exports.getOverview = catchAsync(async (req, res) => {
  //1)get all the product data from collection
  const products = await Product.find();

  //2)Build template
  //3) Render that template using product data from 1
  res.status(200).render('overview', {
    title: 'All Products',
    products: products,
  });
});

exports.getProduct = catchAsync(async (req, res, next) => {
  //1) get the data ,for the request product (include reviews and guides)
  const product = await Product.findOne({ slug: req.params.slug }).populate({
    path: 'reviews',
    fields: 'review rating user',
  });

  if (!product) {
    return next(new AppError('There is no product found with that name', 404));
  }
  //2) build tempate
  //3) render template using data from 1
  res.status(200).render('product', {
    title: product.name,
    product: product,
  });
});

exports.getSignUpForm = (req, res) => {
  res.status(200).render('signUpTemp', {
    title: 'Sign up form',
  });
};

exports.getLoginForm = (req, res) => {
  res.status(200).render('login', {
    title: 'Log in to your account',
  });
};

exports.getAccount = (req, res) => {
  res.status(200).render('account', {
    title: 'Your account',
  });
};

exports.getMyProducts = catchAsync(async (req, res, next) => {
  //1)Find all bookings
  const bookings = await Booking.find({ user: req.user.id });
  //2)Find product with the returned IDs
  const productIDs = bookings.map((el) => el.product.id);
  const products = await Product.find({ _id: { $in: productIDs } }); // it will select all products which are in the products collection and then it will select those currently having productIDs

  res.status(200).render('overview', {
    title: 'My Products',
    products,
  });
});

exports.getAllProductsToManage = catchAsync(async (req, res, next) => {
  const products = await Product.find();
  res.status(200).render('manageProducts', {
    title: 'Administrator',
    products,
  });
});

exports.getProductAddForm = catchAsync(async (req, res, next) => {
  res.status(200).render('productAdd', {
    title: 'Add Product',
  });
});

exports.getProductUpdateForm = catchAsync(async (req, res, next) => {
  const slugId = req.originalUrl.split('/')[2];
  const product = await Product.findOne({ slug: slugId });
  res.status(200).render('productUpdate', {
    title: 'update product ',
    product,
  });
});

exports.getReviewForm = async (req, res, next) => {
  //1)Find all bookings
  const bookings = await Booking.find({ user: req.user.id });
  console.log(req.user.id);
  //2)Find product with the returned IDs
  const product = await Product.findOne({ slug: req.params.slug });
  let returnvalue = false;
  bookings.map(async (el) => {
    if (el.slug === req.params.slug) {
      returnvalue = true;
      return res.status(200).render('review', {
        title: 'My-review',
        product,
      });
    }
  });
  if (returnvalue === false) {
    res.status(200).render('reviewError');
  }
};

exports.getManageUser = catchAsync(async (req, res, next) => {
  const users = await User.find();
  res.status(200).render('manageUser', {
    title: 'Manage Users',
    users,
  });
});

exports.getAllBookings = catchAsync(async (req, res, next) => {
  const bookings = await Booking.find();
  res.status(200).render('allBookingDetails', {
    title: 'All Bookings',
    bookings,
  });
});

exports.aboutCompany = catchAsync(async (req, res, next) => {
  res.status(200).render('aboutUs', {
    title: 'About us',
  });
});
exports.contactCompany = catchAsync(async (req, res, next) => {
  res.status(200).render('contact', {
    title: 'Contact Us',
  });
});
exports.deliveryDetails = catchAsync(async (req, res, next) => {
  res.status(200).render('productDelivary', {
    title: 'Product Delivery',
  });
});

exports.billingInfo = catchAsync(async (req, res, next) => {
  const bookings = await Booking.find({ user: req.user.id });
  res.status(200).render('billings', {
    title: 'Billings',
    bookings,
  });
});

exports.updateUserData = catchAsync(async (req, res, next) => {
  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    {
      name: req.body.name,
      email: req.body.email,
    },
    {
      new: true,
      runValidators: true,
    }
  );
  res.status(200).render('account', {
    title: 'Your account',
    user: updatedUser,
  });
});
