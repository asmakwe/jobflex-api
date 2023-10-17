import httpStatus from "http-status";
import catchAsync from "../../utils/catch-async.js";
import {
  cancelPosting,
  newPosting,
  postingsByEmployer,
  postingsForFlexers,
} from "./posting.service.js";
import paginator from "../../utils/paginator.js";
import { getAllBookedJobsForPosting } from "../job/job.service.js";
import { cancelAllJobsForPosting } from "../job/job-repository.js";

export const getPosting = catchAsync(async (req, res) => {
  const { posting } = req.jobflex;

  /*
  dto

  const result = await (employer
    ? getOnePostingByEmployer(employer, postingId)
    : getAPostingForFlexers(flexer, postingId)); */

  res.status(httpStatus.OK).json({ posting });
});

export const getPostingForFlexer = catchAsync(async (req, res) => {
  const { posting } = req.jobflex;

  /*
  dto

  const result = await (employer
    ? getOnePostingByEmployer(employer, postingId)
    : getAPostingForFlexers(flexer, postingId)); */

  res.status(httpStatus.OK).json({ posting });
});

export const getPostingsForEmployer = catchAsync(async (req, res) => {
  const { page, postingType } = req.query;
  const { employer } = req.jobflex;
  const { skip, limit, nextPageNum } = paginator(page);
  const paginationOptions = { skip, limit };

  const postings = await postingsByEmployer(
    employer,
    postingType,
    paginationOptions
  );

  const nextPage = postings.length < 10 ? undefined : nextPageNum;

  res.status(httpStatus.OK).json({ postings, nextPage });
});

export const getPostingsForFlexer = catchAsync(async (req, res) => {
  const { page } = req.query;
  const { flexer } = req.jobflex;
  const { skip, limit, nextPageNum } = paginator(page);
  const paginationOptions = { skip, limit };

  const postings = await postingsForFlexers(
    flexer,
    req.query,
    paginationOptions
  );

  const nextPage = postings.length < 10 ? undefined : nextPageNum;

  res.status(httpStatus.OK).json({ postings, nextPage });
});

export const createPosting = catchAsync(async (req, res) => {
  const { employer } = req.jobflex;

  const posting = await newPosting(employer, req.body);

  res.status(httpStatus.CREATED).json({
    posting,
  });
});

export const deletePosting = catchAsync(async (req, res) => {
  const { posting } = req.jobflex;

  const jobs = await getAllBookedJobsForPosting(posting);

  await cancelPosting(posting);
  await cancelAllJobsForPosting(posting);
  // email service on allJOBS

  res.status(httpStatus.OK).json({});
});

export const httpEditPostingForEmployer = catchAsync(async (req, res) => {
  res.status(httpStatus.OK).json({ message: "not yet implemented" });
});
