import httpStatus from "http-status";
import {
  approveJobById,
  bookJobById,
  cancelAllJobsForPosting,
  cancelJobById,
  confirmJobById,
  createNewJobQ,
  deleteJobById,
  findAllBookedJobsForPosting,
  findAllFutureBookedJobsByFlexerId,
  findFlexerFutureBookedJobs,
  findFlexerPastJobs,
  findJobByFlexerIdAndPostingId,
  findJobsForPosting,
  findOneJobById,
  findOneJobWithFlexerById,
  findOtherFlexerJobs,
  issueStrikeById,
  offerJob,
} from "./job-repository.js";
import ApiError from "../../utils/api-error.js";
import {
  isBookedJobsGoingToClash,
  isJobUnavailableForViewing,
  isNotJobOwner,
} from "../../utils/help.js";
import { removeHours } from "../../utils/helper.js";
import { appStrings } from "../../constants/index.js";
import { findOneFlexerById } from "../flexer/flexer-repository.js";

export async function offerFlexerAJob(posting, flexerId) {
  const flexer = await findOneFlexerById(flexerId);
  if (!flexer || !flexer.roles.includes(posting.role)) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Invalid");
  }

  const existingJob = await findJobByFlexerIdAndPostingId(flexer, posting);

  if (existingJob) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Flexer has job already");
  }

  return offerJob(posting, flexer);
}

export async function jobApplication(posting, flexer) {
  const existingJob = await findJobByFlexerIdAndPostingId(flexer, posting);

  if (existingJob) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Flexer has job already");
  }

  const allBookedJobs = await findAllFutureBookedJobsByFlexerId(flexer._id);

  if (
    isBookedJobsGoingToClash(allBookedJobs, posting.startTime, posting.endTime)
  ) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Job is clashing with an already booked job"
    );
  }

  return createNewJobQ(flexer, posting);
}

export async function getJobByIdForEmployer(jobId, employer) {
  const job = await findOneJobById(jobId);
  if (!job) {
    throw new ApiError(httpStatus.NOT_FOUND, "Not Found");
  }

  if (employer._id.toString() !== job.posting.employer.id.toString()) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Invalid");
  }

  return job;
}

export async function getJobForFlexer(jobId, flexer) {
  const job = await findOneJobById(jobId);
  if (!job) {
    throw new ApiError(httpStatus.NOT_FOUND, "Not Found");
  }

  if (isJobUnavailableForViewing(job)) {
    throw new ApiError(httpStatus.NOT_FOUND, "Not found");
  }

  if (isNotJobOwner(flexer, job)) {
    throw new ApiError(httpStatus.FORBIDDEN, "Invalid2");
  }

  return job;
}

export async function getUnconfirmedJobById(jobId) {
  const job = await findOneJobById(jobId);
  if (!job) {
    throw new ApiError(httpStatus.NOT_FOUND, "Not Found");
  }

  return job;
}

export async function cancelUnconfirmedShifts(jobId) {
  const job = await findOneJobWithFlexerById(jobId);
  if (!job) {
    throw new ApiError(httpStatus.NOT_FOUND, "Not Found");
  }
  if (job.confirmed) {
    return job;
  }

  if (job.strike.status) {
    throw new ApiError(httpStatus.NOT_FOUND, "Not Found");
  }

  return issueStrikeById(job._id, appStrings.UNCONFIRMED_SHIFT);
}

export async function getFlexerOfferedJobs(flexer, paginationOptions) {
  return findOtherFlexerJobs(flexer, "offered", paginationOptions);
}

export async function getFlexerAppliedJobs(flexer, paginationOptions) {
  return findOtherFlexerJobs(flexer, "applied", paginationOptions);
}

export async function getFlexerPastJobs(flexer, paginationOptions) {
  return findFlexerPastJobs(flexer, paginationOptions);
}

export async function getFlexerBookedJobs(flexer, paginationOptions) {
  return findFlexerFutureBookedJobs(flexer, paginationOptions);
}

export async function getPostingJobs(posting, jobType, paginationOptions) {
  return findJobsForPosting(posting, jobType, paginationOptions);
}

export async function bookJobByFlexer(job, flexer) {
  if (
    job.status !== "offered" ||
    job.clockIn < new Date() ||
    !job.posting.flexerQuantity
  ) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Invalid");
  }

  const allBookedJobs = await findAllFutureBookedJobsByFlexerId(flexer._id);
  if (isBookedJobsGoingToClash(allBookedJobs, job.clockIn, job.clockOut)) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Invalid");
  }
  return bookJobById(job._id);
}

export async function confirmJobFlexer(job) {
  if (
    job.status !== "booked" ||
    job.confirmed ||
    removeHours(job.clockIn, 48) > new Date()
    /*
     * fixme
     *  I guess no need to guard against confirmation
     *  24hrs to job, as agenda shall delete by then
     * */
  ) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Invalid");
  }

  return confirmJobById(job._id);
}

export async function cancelJobByFlexer(job) {
  if (job.status !== "booked" || job.clockIn < new Date()) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Invalid");
  }

  return removeHours(job.clockIn, 24) < new Date()
    ? issueStrikeById(job._id, "Late Cancellation")
    : cancelJobById(job._id);
}

export async function cancelFlexerJobByEmployer(job) {
  if (job.status !== "booked") {
    throw new ApiError(httpStatus.NOT_FOUND, "Invalid4");
  }
  await deleteJobById(job._id);

  return {};
}

export async function approveFlexerJobApplication(job) {
  if (job.status !== "applied") {
    throw new ApiError(httpStatus.NOT_FOUND, "Invalid4");
  }

  return approveJobById(job._id);
}

export async function getExistingJobByFlexerAndPosting(flexerId, postingId) {
  /*
   * fixme
   *  should i error out or send existing job
   *  -
   *  reason: this shouldn't be available to client
   *  except they tinkered around */
  return findJobByFlexerIdAndPostingId(flexerId, postingId);
}

export async function getAllBookedJobsForPosting(posting) {
  return findAllBookedJobsForPosting(posting);
}

export async function deletePostingJobs(posting) {
  return cancelAllJobsForPosting(posting);
}

export async function clockInReminder(jobId) {}

export async function clockOutReminder(jobId) {}
