const path = require('path'); // module

const express = require(`express`);
const morgan = require('morgan');
// eslint-disable-next-line import/no-extraneous-dependencies
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
// eslint-disable-next-line import/no-extraneous-dependencies
const mongoSanitize = require('express-mongo-sanitize');
// eslint-disable-next-line import/no-extraneous-dependencies
const xss = require('xss-clean');
// eslint-disable-next-line import/no-extraneous-dependencies
const hpp = require('hpp');
const cookieParser = require('cookie-parser');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const productRouter = require('./routes/productRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const bookingRouter = require('./routes/bookingRoutes');
const viewRouter = require('./routes/viewRoutes');

// console.log(process.env.NODE_ENV);

const app = express();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

//1) GLOBAL MIDDLEWARE
//set security HTTP header
// app.use(
//   helmet.contentSecurityPolicy({
//     directives: {
//       defaultSrc: ["'self'", 'data:', 'blob:'],

//       fontSrc: ["'self'", 'https:', 'data:'],

//       scriptSrc: ["'self'", 'unsafe-inline'],

//       scriptSrc: ["'self'", 'https://*.cloudflare.com'],

//       scriptSrcElem: ["'self'", 'https:', 'https://*.cloudflare.com'],

//       styleSrc: ["'self'", 'https:', 'unsafe-inline'],

//       connectSrc: ["'self'", 'data', 'https://*.cloudflare.com'],
//     },
//   })
// );

app.use(
  // helmet.contentSecurityPolicy({
  //   directives: {
  //     defaultSrc: ["'self'", 'data:', 'blob:'],
  //     fontSrc: ["'self'", 'https:', 'data:'],
  //     scriptSrc: ["'self'", 'unsafe-inline', 'https://*.cloudflare.com'],
  //     scriptSrcElem: ["'self'", 'https:', 'https://*.cloudflare.com'],
  //     styleSrc: ["'self'", 'https:', 'unsafe-inline'],
  //     connectSrc: ["'self'", 'data:', 'https://*.cloudflare.com'],
  //   },
  // })
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'", 'data:', 'blob:'],
      fontSrc: ["'self'", 'https:', 'data:'],
      scriptSrc: ["'self'", 'unsafe-inline', 'https://*.cloudflare.com'],
      scriptSrcElem: ["'self'", 'https:', 'https://*.cloudflare.com'],
      styleSrc: ["'self'", 'https:', 'unsafe-inline'],
      connectSrc: ["'self'", 'data:', 'https://*.cloudflare.com'],
      frameSrc: ["'self'", 'https://js.stripe.com'],
    },
  })
);

// Development loggimg
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
const limiter = rateLimit({
  max: 150,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP ,please try again in an hour',
});
app.use('/api', limiter);

//Body Parser, reading data from body into req.body
app.use(express.json()); //app.use(express.json({limit:'10kb}));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

//Data clean or sanitization against NOSQL query injection after reading the req.body from the above code
app.use(mongoSanitize()); //remove all $,. in the input data by user or attacker

//Data sanitization against XSS
app.use(xss()); //convert html code into mess

//prevent parameter pollution like "{{URL}}api/v1/products?sort=duration&sort=price"
// using this package we can do like this {{URL}}api/v1/products?duration=5&duration=9 by limiting that specific parameter
app.use(
  hpp({
    whitelist: ['ratingsQuantity', 'ratingsAverage', 'price'],
  })
);

//serving static files
app.use(express.static(path.join(__dirname, 'public')));
// app.use(express.static(`${__dirname}/public`));

// app.use((req, res, next) => {
//   console.log('hello form the middleware');
//   next();
// });

//test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  // console.log(req.headers);
  // console.log(req.cookies);
  next();
});

//3) Routers
app.use('/', viewRouter);
app.use('/api/v1/products', productRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/bookings', bookingRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Cant find ${req.originalUrl} on this server`, 404));
});

app.use(globalErrorHandler);
module.exports = app;
