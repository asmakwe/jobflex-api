import httpStatus from "http-status";
import catchAsync from "../utils/catch-async.js";
import { getPermittedFlexerByAuthId } from "../features/flexer/flexer-service.js";
import ApiError from "../utils/api-error.js";
import { findOneEmployerById } from "../features/employer/employer-repository.js";
import {
  getExistingJobByFlexerAndPosting,
  getJobByIdForEmployer,
  getJobForFlexer,
} from "../features/job/job.service.js";
import { getPostingById } from "../features/posting/posting.service.js";
import {
  isFlexerVerifiedForRole,
  isNotPostingOwner,
  isPostingAvailableForViewing,
} from "../utils/help.js";

export const isFlexer = catchAsync(async (req, res, next) => {
  const authId = req.session.getUserId();
  const { flexerId, postingId, jobId } = req.params;
  req.jobflex = {};
  let job;
  let posting;

  const flexer = await getPermittedFlexerByAuthId(authId, flexerId);

  req.jobflex.flexer = flexer;

  if (jobId) {
    job = await getJobForFlexer(jobId, flexer);

    req.jobflex.job = job;
  }

  if (postingId) {
    const existingJob = await getExistingJobByFlexerAndPosting(
      flexer._id,
      postingId
    );
    if (existingJob) {
      throw new ApiError(httpStatus.NOT_FOUND, "Invalid");
    }
    posting = await getPostingById(postingId);

    if (!isPostingAvailableForViewing(posting)) {
      throw new ApiError(httpStatus.NOT_FOUND, "Invalid2");
    }

    if (!isFlexerVerifiedForRole(flexer.roles, posting.role)) {
      throw new ApiError(
        httpStatus.FORBIDDEN,
        "Flexer is not verified for job role"
      );
    }

    req.jobflex.posting = posting;
  }

  next();
});

export const isEmployer = catchAsync(async (req, res, next) => {
  // const authId = req.session.getUserId();
  const { employerId, postingId, jobId } = req.params;
  req.jobflex = {};

  let posting;
  let job;

  // ====================================
  const employerIdTemp = "651e6cd27c19c351b6dc17f9";
  const employer = await findOneEmployerById(employerIdTemp);
  if (!employer) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Kindly sign in to continue");
  }

  if (employerId && employer._id.toString() !== employerId) {
    throw new ApiError(httpStatus.FORBIDDEN, "Invalid");
  }
  // =====================================

  if (postingId) {
    posting = await getPostingById(postingId);

    if (isNotPostingOwner(employer, posting)) {
      throw new ApiError(httpStatus.NOT_FOUND, "Invalid");
    }

    req.jobflex.posting = posting;
  }

  if (jobId) {
    job = await getJobByIdForEmployer(jobId, employer);

    req.jobflex.job = job;
  }

  req.jobflex.employer = employer;
  next();
});
