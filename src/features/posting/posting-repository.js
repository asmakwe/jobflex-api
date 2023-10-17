/* eslint-disable object-shorthand  */
/* eslint-disable unicorn/no-array-for-each */
/* eslint-disable dot-notation */
import Posting from "./posting.model.js";

/*
 * none by employers that blacklisted the flexer
 * none clashing with booked jobs
 * none that has already been applied or offered to
 * */
export async function findNonClashingAvailablePostings({
  allFlexerJobs,
  blacklistedBy,
  rolesToSearch,
  employerIds,
  latitude,
  longitude,
  metUnit,
  circleRadius,
  limit,
  skip,
}) {
  const radOfEarth = metUnit === "miles" ? 3963.2 : 6378.1;

  const conditions = { $and: [] };

  blacklistedBy.forEach((item) => {
    conditions["$and"].push({ "employer.id": { $ne: item.employer } });
  });

  allFlexerJobs.forEach((job) => {
    if (job.status === "booked") {
      const temp = [
        {
          $and: [
            { startTime: { $gt: new Date() } },
            { startTime: { $gt: job.clockOut } },
            { endTime: { $gt: job.clockOut } },
          ],
        },
        {
          $and: [
            { startTime: { $gt: new Date() } },
            { startTime: { $lt: job.clockIn } },
            { endTime: { $lt: job.clockIn } },
          ],
        },
      ];

      conditions["$and"].push({ $or: temp }, { _id: { $ne: job.posting._id } });
    } else {
      conditions["$and"].push({ _id: { $ne: job.posting._id } });
    }
  });

  conditions["$and"].push(
    { role: { $in: rolesToSearch } },
    {
      location: {
        $geoWithin: {
          $centerSphere: [[longitude, latitude], circleRadius / radOfEarth],
        },
      },
    }
  );

  if (employerIds?.length !== 0) {
    conditions["$and"].push({ employer: { $in: employerIds } });
  }

  conditions["$and"].push(
    { flexerQuantity: { $gt: 0 } },
    { public: { $eq: true } },
    { startTime: { $gt: new Date() } }
  );

  return Posting.find({ ...conditions })
    .skip(skip)
    .limit(limit)
    .exec();
}

export async function deleteOnePostingById(postingId) {
  return Posting.findByIdAndDelete(postingId);
}

export async function createNewPosting(employer, data) {
  const newDoc = {
    startTime: data.startTime,
    endTime: data.endTime,
    employer: { id: employer._id, logo: employer.logo, name: employer.name },
    role: data.role,
    flexerQuantity: data.flexerQuantity,
    hourlyPay: data.hourlyPay,
    hourlyHolidayPay: data.hourlyHolidayPay,
    location: {
      coordinates: [data.longitude, data.latitude],
      postcode: data.postcode,
      city: data.city,
      address: data.address,
      name: data.name,
    },
    uniform: { description: data.uniformDescription },
    instructions: data.instructions,
    description: data.description,
    skills: data.skills,
  };
  return Posting.create(newDoc);
}

export async function findOnePostingById(postingId) {
  return Posting.findById(postingId).exec();
}

export async function findOnePosting(conditions) {
  return Posting.find({ ...conditions }).exec();
}

export async function updateAPosting(posting, update) {
  return Posting.findByIdAndUpdate(posting._id, update, { new: true });
}

export async function findAllPostings(conditions, options) {
  if (options.skip && options.limit) {
    return Posting.find({ ...conditions })
      .skip(options.skip)
      .limit(options.limit)
      .exec();
  }

  return Posting.find({ ...conditions }).exec();
}

export async function findPastPostings(employer, options) {
  return Posting.find({
    endTime: { $lt: new Date() },
    "posting.employer.id": { $eq: employer._id },
  })
    .skip(options.skip)
    .limit(options.limit)
    .exec();
}

export async function findFuturePostings(employer, options) {
  return Posting.find({
    endTime: { $gt: new Date() },
    "employer.id": { $eq: employer._id },
  })
    .skip(options.skip)
    .limit(options.limit)
    .exec();
}

export async function increaseFlexerQuantityByOne(posting) {
  return Posting.findByIdAndUpdate(posting._id, {
    flexerQuantity: posting.flexerQuantity + 1,
  });
}

export async function decreaseFlexerQuantityByOne(posting) {
  return Posting.findByIdAndUpdate(posting._id, {
    flexerQuantity: posting.flexerQuantity - 1,
  });
}
