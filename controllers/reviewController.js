const factory = require('./handlerFactory');
// const catchAsync = require('../utils/catchAsync');
const Review = require('./../models/reviewModel');

//  catchAsync(async (req, res, next) => {
//   let filter = {};
//   if (req.params.productId) filter = { tour: req.params.productId };
//   const reviews = await Review.find(filter);

//   res.status(200).json({
//     status: 'success',
//     result: reviews.length,
//     data: {
//       reviews,
//     },
//   });
// });
exports.setProductUserIds = (req, res, next) => {
  //Allow nested routes
  if (!req.body.user) req.body.user = req.user.id;
  console.log(req.body);
  next();
};
exports.getAllReviews = factory.getAll(Review);
exports.getReview = factory.getOne(Review);
exports.createReview = factory.createOne(Review);
exports.updateReview = factory.updateOne(Review);
exports.deleteReview = factory.deleteOne(Review);
//  exports.createReview =catchAsync(async (req, res, next) => {
//   const newReview = await Review.create(req.body);

//   res.status(201).json({
//     status: 'success',
//     data: {
//       newReview,
//     },
//   });
// });
