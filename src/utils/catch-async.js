function catchAsync(func) {
  return async function catchAllErrors(req, res, next) {
    // todo console res, res, next
    try {
      await func(req, res, next);
    } catch (error) {
      next(error);
    }
  };
}

/* const catchAsync = (fn) => (req, res, next) => {
  // eslint-disable-next-line promise/no-callback-in-promise
  Promise.resolve(fn(req, res, next)).catch((error) => next(error));
}; */

export default catchAsync;
