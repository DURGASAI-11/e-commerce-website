const express = require('express');

const productController = require('../controllers/productController');
const authController = require('../controllers/authController');
const reviewRouter = require('./reviewRoutes');

const router = express.Router();
// router.param('id', productController.checkID);

//create a checkBody middleware
//check if body contains the name and price  property
// if not  ,send back 400 (bad request)
//add it to the post handler stack

// nested routes
//POST /product/234fadsf/reviews
//GET /product/234fadsf/reviews

router.use('/:productId/reviews', reviewRouter);

router
  .route('/top-5-cheap')
  .get(productController.aliasTopProduct, productController.getAllProducts);

// router.route('/tour-stats').get(productController.getProductStats);
router
  .route('/monthly-plan/:year')
  .get(
    authController.protect,
    authController.restrictTo('admin'),
    productController.getMonthlyPlan
  );
router
  .route('/')
  .get(productController.getAllProducts)
  .post(
    authController.protect,
    authController.restrictTo('admin'),
    productController.uploadProductPhotos,
    productController.resizeProductPhotos,
    productController.createProduct
  );

router
  .route('/:id')
  .get(productController.getProduct)
  .patch(
    authController.protect,
    authController.restrictTo('admin'),
    productController.uploadProductImages,
    productController.resizeProductImages,
    productController.updateProduct
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin'),
    productController.deleteProduct
  );

module.exports = router;
