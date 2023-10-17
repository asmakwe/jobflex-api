/* eslint-disable unicorn/no-array-for-each */

import Job from "./job.model.js";

const returnNew = { new: true };

export async function offerJob(posting, flexer) {
  return Job.create({
    status: "offered",
    flexer: flexer._id,
    posting: posting._id,
    clockIn: posting.startTime,
    clockOut: posting.endTime,
  });
}

export async function cancelAllJobsForPosting(posting) {
  return Job.deleteMany({ posting: posting._id }).exec();
}

export async function findAllBookedJobsForPosting(posting) {
  return Job.find({
    posting: posting._id,
    status: "booked",
  })
    .populate("flexer")
    .exec();
}

export async function findJobsForPosting(posting, jobType, paginationOptions) {
  return Job.find({
    posting: posting._id,
    status: jobType,
  })
    .populate("flexer")
    .skip(paginationOptions.skip)
    .limit(paginationOptions.limit)
    .exec();
}

export async function findAllFlexerJobs(flexer) {
  return Job.find({ flexer: flexer._id }).populate("posting").exec();
}

export async function findJobByFlexerIdAndPostingId(flexerId, postingId) {
  return Job.findOne({
    flexer: flexerId,
    posting: postingId,
  })
    .lean()
    .exec();
}

export async function findOneJobById(jobId) {
  return Job.findById(jobId).populate("posting").lean().exec();
}

export async function findOneJobWithFlexerById(jobId) {
  return Job.findById(jobId).populate("flexer").lean().exec();
}

export async function createNewJobQ(flexer, posting) {
  return Job.create({
    status: "applied",
    flexer: flexer._id,
    posting: posting._id,
    clockIn: posting.startTime,
    clockOut: posting.endTime,
  });
}

export async function updateAJob(job, update) {
  return Job.findByIdAndUpdate(job._id, update, returnNew)
    .populate("posting")
    .exec();
}

export async function deleteJobById(jobId) {
  return Job.findByIdAndDelete(jobId);
}

export async function findFlexerPastJobs(flexer, paginationOptions) {
  return Job.find({
    status: "booked",
    flexer: flexer._id,
    clockOut: { $lt: new Date() },
  })
    .skip(paginationOptions.skip)
    .limit(paginationOptions.limit)
    .populate("posting")
    .exec();
}

export async function findFlexerFutureBookedJobs(flexer, paginationOptions) {
  return Job.find({
    status: "booked",
    flexer: flexer._id,
    clockOut: { $gt: new Date() },
  })
    .skip(paginationOptions.skip)
    .limit(paginationOptions.limit)
    .populate("posting")
    .exec();
}

export async function findAllFutureBookedJobsByFlexerId(flexerId) {
  return Job.find({
    status: "booked",
    flexer: flexerId,
    clockOut: { $gt: new Date() },
  })
    .populate("posting")
    .exec();
}

/*
 * fixme
 *  move to aggregation and use lookup
 *  -
 *  ultimately learn sql so as to avoid use mongo lookup
 * */
export async function findOtherFlexerJobs(
  flexerId,
  jobType,
  paginationOptions
) {
  const conditions = { $and: [{ flexer: flexerId }] };
  const bookedJobs = await Job.find({
    status: "booked",
    flexer: flexerId,
    clockOut: { $gt: new Date() },
  })
    .lean()
    .exec();

  const otherJobs = await Job.find({
    flexer: flexerId,
    status: jobType,
    clockIn: { $gt: new Date() },
  })
    .populate("posting")
    .lean()
    .exec();

  if (otherJobs.length > 0) {
    otherJobs.forEach((job) => {
      if (job.posting.flexerQuantity === 0) {
        conditions.$and.push({ _id: { $ne: job._id } });
      }
    });
  }

  if (bookedJobs.length === 0) {
    conditions.$and.push({ status: jobType }, { clockIn: { $gt: new Date() } });
  } else {
    bookedJobs.forEach((job) => {
      const temp = [
        {
          $and: [
            { status: { $eq: jobType } },
            { clockIn: { $gt: new Date() } },
            { clockIn: { $gt: job.clockOut } },
            { clockOut: { $gt: job.clockOut } },
          ],
        },
        {
          $and: [
            { status: { $eq: jobType } },
            { clockIn: { $gt: new Date() } },
            { clockIn: { $lt: job.clockIn } },
            { clockOut: { $lt: job.clockIn } },
          ],
        },
      ];

      conditions.$and.push({ $or: temp });
    });
  }

  return Job.find({ ...conditions })
    .skip(paginationOptions.skip)
    .limit(paginationOptions.limit)
    .populate("posting")
    .exec();
}

export async function cancelJobById(jobId) {
  return Job.findByIdAndUpdate(
    jobId,
    { status: "offered", confirmed: false },
    returnNew
  );
}

export async function issueStrikeById(jobId, reason) {
  return Job.findByIdAndUpdate(
    jobId,
    {
      strike: {
        status: true,
        reason,
      },
    },
    returnNew
  );
}

export async function confirmJobById(jobId) {
  return Job.findByIdAndUpdate(
    jobId,
    {
      confirmed: true,
    },
    returnNew
  );
}

export async function bookJobById(jobId) {
  return Job.findByIdAndUpdate(
    jobId,
    {
      status: "booked",
    },
    returnNew
  );
}

export async function approveJobById(jobId) {
  return Job.findByIdAndUpdate(jobId, { status: "offered" }, returnNew);
}
