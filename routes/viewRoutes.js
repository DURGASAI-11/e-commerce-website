const express = require('express');
const viewsController = require('./../controllers/viewsController');
const authController = require('../controllers/authController');
const bookingController = require('../controllers/bookingController');
// const reviewController = require('../controllers/reviewController');
const router = express.Router();

router.get(
  '/',
  bookingController.createBookingCheckout,
  authController.isLoggedIn,
  viewsController.getOverview
);

router.get(
  '/product/:slug',
  authController.isLoggedIn,
  viewsController.getProduct
);
router.get('/signUp', viewsController.getSignUpForm);
router.get('/login', authController.isLoggedIn, viewsController.getLoginForm);
router.get('/me', authController.protect, viewsController.getAccount);
router.get(
  '/my-review/:slug',
  authController.protect,
  viewsController.getReviewForm
);

router.get(
  '/my-products',
  authController.protect,
  viewsController.getMyProducts
);

router.get(
  '/manage-products',
  authController.protect,
  authController.restrictTo('admin'),
  viewsController.getAllProductsToManage
);

router.get(
  '/product-add',
  authController.protect,
  authController.restrictTo('admin'),
  viewsController.getProductAddForm
);

router.get(
  '/product-update/:slug',
  authController.protect,
  authController.restrictTo('admin'),
  viewsController.getProductUpdateForm
);

router.get(
  '/manage-user',
  authController.protect,
  authController.restrictTo('admin'),
  viewsController.getManageUser
);

router.get(
  '/all-bookings',
  authController.protect,
  authController.restrictTo('admin'),
  viewsController.getAllBookings
);
router.get('/aboutCompany', viewsController.aboutCompany);
router.get('/contact', authController.protect, viewsController.contactCompany);
router.get(
  '/productDelivery',
  authController.protect,
  viewsController.deliveryDetails
);

router.get('/billings', authController.protect, viewsController.billingInfo);

router.post(
  '/submit-user-data',
  authController.protect,
  viewsController.updateUserData
);
module.exports = router;
