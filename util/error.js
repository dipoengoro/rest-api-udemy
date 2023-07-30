exports.handle = (e, req, res, next) => {
  if (!e.statusCode) {
    e.statusCode = 500;
  }
  next(e);
};