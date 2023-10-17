import httpStatus from "http-status";
import catchAsync from "../../utils/catch-async.js";
import {
  approveFlexerJobApplication,
  bookJobByFlexer,
  cancelFlexerJobByEmployer,
  cancelJobByFlexer,
  confirmJobFlexer,
  getFlexerAppliedJobs,
  getFlexerBookedJobs,
  getFlexerOfferedJobs,
  getFlexerPastJobs,
  getPostingJobs,
  jobApplication,
  offerFlexerAJob,
} from "./job.service.js";
import paginator from "../../utils/paginator.js";
import {decreaseFlexerQuantityForPosting, increaseFlexerQuantityForPosting,} from "../posting/posting.service.js";

// todo no forget encode and decode uri
// todo react-native-toast-message
// keyboard avoiding view and safe area view

export const postingJobs = catchAsync(async (req, res) => {
  const { page, jobType } = req.query;
  const { posting } = req.jobflex;

  const { skip, limit, nextPageNum } = paginator(page);
  const paginationOptions = { skip, limit };

  const jobs = await getPostingJobs(posting, jobType, paginationOptions);

  const nextPage = jobs.length < 10 ? undefined : nextPageNum;

  res.status(httpStatus.OK).json({ jobs, nextPage });
});

export const flexerJobs = catchAsync(async (req, res) => {
  const { page, jobType } = req.query;
  const { flexer } = req.jobflex;

  const { skip, limit, nextPageNum } = paginator(page);
  const paginationOptions = { skip, limit };

  let jobs;

  switch (jobType) {
    case "booked": {
      jobs = await getFlexerBookedJobs(flexer, paginationOptions);

      break;
    }
    case "offered": {
      /*
       *
       * fixme
       *  for offered, sort by date, pay and location */
      jobs = await getFlexerOfferedJobs(flexer, paginationOptions);

      break;
    }
    case "applied": {
      jobs = await getFlexerAppliedJobs(flexer, paginationOptions);

      break;
    }
    default: {
      jobs = getFlexerPastJobs(flexer, paginationOptions);
    }
  }

  const nextPage = jobs.length < 10 ? undefined : nextPageNum;

  res.status(httpStatus.OK).json({ jobs, nextPage });
});

export const flexerJob = catchAsync(async (req, res) => {
  const { job } = req.jobflex;

  // dto

  res.status(httpStatus.OK).json({ job });
});

export const cancelJobForFlexer = catchAsync(async (req, res) => {
  const { job } = req.jobflex;

  const cancelledJob = await cancelJobByFlexer(job);
  await increaseFlexerQuantityForPosting(job.posting);

  return res.status(httpStatus.OK).json({ job: cancelledJob });
});

export const bookJobForFlexer = catchAsync(async (req, res) => {
  const { job, flexer } = req.jobflex;

  const bookedJob = await bookJobByFlexer(job, flexer);
  await decreaseFlexerQuantityForPosting(job.posting);

  return res.status(httpStatus.OK).json({ job: bookedJob });
});

export const confirmJobForFlexer = catchAsync(async (req, res) => {
  const { job } = req.jobflex;

  const confirmedJob = await confirmJobFlexer(job);

  return res.status(httpStatus.OK).json({ job: confirmedJob });
});

export const employerActionOnJob = catchAsync(async (req, res) => {
  const { job } = req.jobflex;
  const { action } = req.body;
  let updatedJob;

  if (action === "approve") {
    updatedJob = await approveFlexerJobApplication(job);
  }

  if (!action) {
    updatedJob = await cancelFlexerJobByEmployer(job);
    await increaseFlexerQuantityForPosting(job.posting);
  }

  return res.status(httpStatus.OK).json({ job: updatedJob });
});

export const newJob = catchAsync(async (req, res) => {
  const { flexer, posting } = req.jobflex;

  const job = await jobApplication(posting, flexer);

  res.status(httpStatus.OK).json({ job });
});

export const offer = catchAsync(async (req, res) => {
  const { posting } = req.jobflex;
  const { flexerId } = req.body;

  const job = await offerFlexerAJob(posting, flexerId);

  res.status(httpStatus.OK).json({ job });
});
