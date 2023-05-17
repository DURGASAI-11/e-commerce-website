const mongoose = require('mongoose');
const slugify = require('slugify');
// const validator = require('validator');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A product must have a name'],
      unique: true,
      trim: true,
      maxlength: [40, 'A product name must have less or equal 40 characters'],
      minlength: [3, 'A product name must have more or equal 10 characters'],
      // validate: [validator.isAlpha, 'product name must only contain characters'],
    },
    slug: {
      type: 'String',
      required: [true, 'A product must have a slug'],
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must be below 5.0'],
      set: (val) => Math.round(val * 10) / 10, // 4.6666,46.66,47 ,4.7
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, 'A product must have a price'],
    },
    unit: { type: String, required: [true, 'A product must have a Quantity'] },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (val) {
          // thi only points to current doc on NEW document creation
          return val < this.price;
        },
        message: 'Discount price ({VALUE}) should be below regular price',
      },
    },
    summary: {
      type: String,
      trim: true,
      required: [true, 'Aproduct must have a summary'],
    },
    description: {
      type: String,
      trim: true,
      required: [true, 'A product must have a description'],
    },
    imageCover: {
      type: String,
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: true,
    },
    secretProduct: {
      type: Boolean,
      default: false,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// productSchema.index({ price: 1 });
productSchema.index({ price: 1, ratingsAverage: -1 });
productSchema.index({ slug: 1 });

//Virtual populate
productSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'product',
  localField: '_id',
});

//DOCUMENT MIDDLEWARE :runs before .save() and .create()
productSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});
//save is a hook which makes it as a document middleware
// productSchema.pre('save', function (next) {
//   console.log('will save document.....');
//   next();
// });
// productSchema.post('save', function (doc, next) {
//   console.log(doc);
//   next();
// });

//QUERY MIDDLEWARE
//find is a "HOOK" or "middleware" which makes it as a query
productSchema.pre(/^find/, function (next) {
  this.find({ secretProduct: { $ne: true } });
  this.start = Date.now();
  next();
});
productSchema.post(/^find/, function (doc, next) {
  console.log(`query took ${Date.now() - this.start} milliseconds`);
  // console.log(doc);
  next();
});

// AGGREGATION MIDDLEWARE
productSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { secretProduct: { $ne: true } } });
  console.log(this.pipeline());
  next();
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
