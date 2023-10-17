import Joi from "joi";
import httpStatus from "http-status";
import ApiError from "../utils/api-error.js";

export default function validateBodyMiddleware(schema) {
  return function validateBody(req, res, next) {
    const { value, error } = Joi.compile(schema).validate(req.body);

    if (error) {
      const errorMessage = error.details
        .map((details) => details.message)
        .join(", ");

      return next(new ApiError(httpStatus.BAD_REQUEST, errorMessage));
    }

    Object.assign(req, value);
    return next();
  };
}
