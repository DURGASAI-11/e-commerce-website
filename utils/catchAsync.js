module.exports = (fn) => {
  //catchAsync function having a fn(function as a aurgument)
  return (req, res, next) => {
    //the above catchAsync() function returns an arrow function "()=>{}" with some aurguments "r,r,n"
    fn(req, res, next).catch((err) => next(err)); //then the above arrow function having a function(fn) inside it and it is attached with catch
  }; //which will call next() middleware which handle the error (if error occurs)
};
