import httpStatus from "http-status";
import ApiError from "../../utils/api-error.js";
import {
  createNewEmployer,
  findOneEmployerByAuthId,
  findOneEmployerByEmail,
  updateAnEmployer,
} from "./employer-repository.js";

export async function createEmployer(data) {
  const employer = await findOneEmployerByEmail(data.email);

  if (employer) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Invalid");
  }
  return createNewEmployer(data);
}

export async function getEmployerByAuthId(authId, employerIdParam) {
  const employer = await findOneEmployerByAuthId(authId);

  if (!employer) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Kindly sign in to continue");
  }

  if (employerIdParam && employer._id.toString() !== employerIdParam) {
    throw new ApiError(httpStatus.FORBIDDEN, "Invalid");
  }

  return employer;
}

export async function updateAnEmployerProfile(employer, data) {
  const { name, email, logo } = data;
  return updateAnEmployer(employer, { name, email, logo });
}
