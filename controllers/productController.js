const multer = require('multer');
const jimp = require('jimp');
const Product = require('../models/productModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('./../utils/appError');
const factory = require('./handlerFactory');

const multerStorage = multer.memoryStorage();
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not a image! please upload only imagges', 400), false);
  }
};
const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

exports.uploadProductImages = upload.fields([
  { name: 'imageCover', maxCount: 1 },
  { name: 'images', maxCount: 3 },
]);

exports.uploadProductPhotos = upload.fields([
  { name: 'imageCover', maxCount: 1 },
  { name: 'images', maxCount: 3 },
]);

// upload.single('images'); req.file
// upload.array('images', 5); req.files

exports.resizeProductImages = catchAsync(async (req, res, next) => {
  // console.log(req.files);
  if (!req.files.imageCover || !req.files.images) return next();
  //1) cover images
  const image = await jimp.read(req.files.imageCover[0].buffer);

  req.body.imageCover = `product-${req.params.id}-${Date.now()}-cover.jpeg`;
  console.log(req.query.slug);

  await image
    .resize(2000, 1333)
    .quality(90)
    .write(`public/img/products/${req.body.imageCover}`);
  req.files.imageCover[0] = req.body.imageCover;

  //2) images
  req.body.images = [];

  await Promise.all(
    req.files.images.map(async (file, i) => {
      const filename = `product-${req.params.id}-${Date.now()}-${i + 1}.jpeg`;

      const images = await jimp.read(file.buffer);
      await images
        .resize(2000, 1333)
        .quality(90)
        .write(`public/img/products/${filename}`);
      // req.files.imageCover[0] = req.body.imageCover;
      req.body.images.push(filename);
    })
  );
  console.log(req.body);
  next();
});

exports.resizeProductPhotos = catchAsync(async (req, res, next) => {
  // console.log(req.files);
  if (!req.files.imageCover || !req.files.images) return next();
  //1) cover images
  const image = await jimp.read(req.files.imageCover[0].buffer);

  req.body.imageCover = `product-${Date.now()}-cover.jpeg`;
  console.log(req.query.slug);

  await image
    .resize(2000, 1333)
    .quality(90)
    .write(`public/img/products/${req.body.imageCover}`);
  req.files.imageCover[0] = req.body.imageCover;

  //2) images
  req.body.images = [];

  await Promise.all(
    req.files.images.map(async (file, i) => {
      const filename = `product-${Date.now()}-${i + 1}.jpeg`;

      const images = await jimp.read(file.buffer);
      await images
        .resize(2000, 1333)
        .quality(90)
        .write(`public/img/products/${filename}`);
      // req.files.imageCover[0] = req.body.imageCover;
      req.body.images.push(filename);
    })
  );
  console.log(req.body);
  next();
});

exports.aliasTopProduct = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary';
  next();
};
exports.getAllProducts = factory.getAll(Product);

exports.getProduct = factory.getOne(Product, { path: 'reviews' });

exports.createProduct = factory.createOne(Product);

exports.updateProduct = factory.updateOne(Product);

exports.deleteProduct = factory.deleteOne(Product);

exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
  const year = req.params.year * 1; //2021

  const plan = await Product.aggregate([
    {
      $unwind: '$startDates',
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { $month: '$startDates' },
        numProductStarts: { $sum: 1 },
        products: { $push: '$name' },
      },
    },
    {
      $addFields: { month: '$_id' },
    },
    {
      $project: {
        _id: 0,
      },
    },
    {
      $sort: { numProductStarts: -1 },
    },
    {
      $limit: 12,
    },
  ]);
  res.status(200).json({
    status: 'success',
    data: { plan },
  });
});

//when we use try catch instead of catchAsync function

// exports.getProduct = async (req, res) => {
//   try {
//     const product = await Tour.findById(req.params.id);
//     //Tour.findOne({_id:req.params.id})
//     res.status(200).json({
//       status: 'success',
//       data: { product },
//     });
//   } catch (err) {
//     res.status(404).json({
//       status: 'fail',
//       message: err,
//     });
//   }
