import mongoose from "mongoose";
import httpStatus from "http-status";
import ApiError from "../utils/api-error.js";
import config from "../config/index.js";

function customErrorHandler(err, req, res) {
  let error = err;
  /*
   * any error that may be thrown not anticipated by app
   * either programming errors or errors thrown by used libraries
   * details should not be leaked to users
   * */
  if (!(error instanceof ApiError)) {
    const statusCode =
      error.statusCode || error instanceof mongoose.Error
        ? httpStatus.BAD_REQUEST
        : httpStatus.INTERNAL_SERVER_ERROR;
    // eslint-disable-next-line security/detect-object-injection
    const message = error.message || httpStatus[statusCode];
    error = new ApiError(statusCode, message, false, error.stack);
  }

  let { statusCode, message, isOperational, stack } = error;

  if (config.nodeEnv === "production" && !isOperational) {
    statusCode = httpStatus.INTERNAL_SERVER_ERROR;
    message = httpStatus[httpStatus.INTERNAL_SERVER_ERROR];
  }

  const response = {
    code: statusCode,
    message,
    ...(process.env.NODE_ENV === "development" && { stack }),
  };
  console.log("my error handler", response);

  // todo: should we log errors here

  res.status(statusCode).json(response);
}

export default customErrorHandler;
