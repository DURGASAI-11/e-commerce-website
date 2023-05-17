const AppError = require('./../utils/appError');

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path} : ${err.value}.`;
  return new AppError(message, 400);
};
const handleDuplicateFieldsDB = (err) => {
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
  // console.log(value);
  const message = `Duplicate field value: ${value}. please use another value!`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => {
    return el.message;
  });
  const message = `Invalid input data.${errors.join('. ')}`;
  return new AppError(message, 400);
};

const handleJWTError = () => {
  console.log('this is handleJWTError');
  return new AppError('Invalid token please logn again!', 401);
};

const handleJWTExpiredError = () => {
  return new AppError(' your token expired! please login again', 401);
};
const sendErrorDev = (err, req, res) => {
  //A) API
  if (req.originalUrl.startsWith('/api')) {
    return res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  }

  // B) Render website
  console.log('Error 😒', err);
  return res.status(err.statusCode).render('error', {
    title: 'Something went wrong',
    msg: err.message,
  });
};

const sendErrorProd = (err, req, res) => {
  //API
  if (req.originalUrl.startsWith('/api')) {
    // operational , trusted error: send message to client
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    }
    //1)log the error
    console.log('Error 😒', err);
    //2) send generic message
    return res.status(500).json({
      status: 'error',
      message: 'something went very wrong',
    });
  }

  //Render website
  //Operational ,trusted error: send message to client
  if (err.isOperational) {
    console.log('Error 😒', err);
    return res.status(err.statusCode).render('error', {
      title: 'Something went wrong',
      msg: err.message,
    });
  }
  //Programming or other unknown error:dont leak error details
  //1)log the error
  console.log('Error 😒', err);
  //send generic message
  return res.status(err.statusCode).render('error', {
    title: 'Something went wrong',
    msg: 'please try again later',
  });
};

module.exports = (err, req, res, next) => {
  //   console.log(err.stack);

  err.statusCode = err.statusCode || 500; // error code
  // console.log(err.statusCode);
  err.status = err.status || 'error'; // error message

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, req, res);
  } else if (process.env.NODE_ENV === 'production') {
    // let error = { ...err };
    // console.log(err.name);
    if (err.name === 'CastError') {
      // console.log('going to handleDB fun');
      err = handleCastErrorDB(err);
    }
    if (err.code === 11000) err = handleDuplicateFieldsDB(err);
    if (err.name === 'ValidationError') err = handleValidationErrorDB(err);
    // console.log(err.name);
    if (err.name === 'JsonWebTokenError') err = handleJWTError(err);
    if (err.name === 'TokenExpiredError') err = handleJWTExpiredError(err);
    sendErrorProd(err, req, res);
  }
};
