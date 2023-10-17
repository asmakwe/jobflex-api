/* eslint-disable object-shorthand  */
/* eslint-disable unicorn/no-array-for-each */
/* eslint-disable dot-notation */
import httpStatus from "http-status";
import ApiError from "../../utils/api-error.js";
import {
  createNewPosting,
  decreaseFlexerQuantityByOne,
  deleteOnePostingById,
  findFuturePostings,
  findNonClashingAvailablePostings,
  findOnePostingById,
  findPastPostings,
  increaseFlexerQuantityByOne,
} from "./posting-repository.js";
import {findAllFlexerJobs} from "../job/job-repository.js";
import {findAllBlacklistingAFlexer} from "../network/network-repository.js";
import {isNotValidRole} from "../../utils/help.js";
import {removeHours} from "../../utils/helper.js";

export async function getPostingById(postingId) {
  const posting = await findOnePostingById(postingId);
  if (!posting) {
    throw new ApiError(httpStatus.NOT_FOUND, "Not Found");
  }

  return posting;
}

// =================================

export async function newPosting(employer, data) {
  const {
    role,
    // flexerQuantity,
    hourlyPay,
    hourlyHolidayPay,
    // longitude,
    // latitude,
    // postcode,
    // city,
    // address,
    // name,
    // uniformDescription,
    // instructions,
    // description,
    // skills,
  } = data;
  // also check if skill is valid
  const startTime = new Date(data.startTime);
  console.log(startTime);
  const endTime = new Date(data.endTime);

  if (
    startTime > removeHours(endTime, 4) ||
    isNotValidRole(role) ||
    hourlyPay < 10.42 ||
    hourlyHolidayPay < 1.23
  ) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Invalid");
  }

  return createNewPosting(employer, { ...data, startTime, endTime });
}

export async function getOnePostingByEmployer(employer, postingId) {
  const posting = await findOnePostingById(postingId);

  if (!posting) {
    throw new ApiError(httpStatus.NOT_FOUND, "Not Found");
  }

  if (employer._id !== posting.employer.id) {
    throw new ApiError(httpStatus.NOT_FOUND, "Not Found");
  }

  return posting;
}

export async function postingsByEmployer(
  employer,
  postingType,
  paginationOptions
) {
  return postingType === "past"
    ? findPastPostings(employer, paginationOptions)
    : findFuturePostings(employer, paginationOptions);
}

export async function deleteOnePostingByEmployer(posting) {
  if (posting.startTime < new Date()) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Kindly tell flexers to clock out"
    );
  }
  return deleteOnePostingById(posting);
}

/*
 * fixme
 *  convert the generated query to an aggregation pipeline,
 *  so as to utilize $unwind for postings with multiple days */
// done
// jobflex.io/postings
export async function postingsForFlexers(flexer, query, paginationOptions) {
  const { metricUnit, long, lat, radius, roles, employerId } = query;

  /*
   * is the startTime within the flexer's chosen time range
   *
   * may implement work time directive or just give hour gaps
   *
   * show jobs in tandem with worker chosen total hours per week
   * get sum of working hours and show jobs which added hours would
   * be below chosen cap
   *
   * filter by dates
   *
   * sort by date, distance and pay
   * */

  // todo check name, address, pref, role
  // todo: this should be handled as feature flag check(isProfileComplete)
  if (flexer.roles.length === 0) {
    console.log("Fill up profile");
    throw new ApiError(httpStatus.BAD_REQUEST, "Fill up profile");
  }
  const requestedRoles = roles ? roles?.split(",") : [];
  const employerIds = employerId ? employerId?.split(",") : [];

  // ================================================================

  const rolesToSearch =
    requestedRoles?.length === 0
      ? flexer.roles.flatMap((el) => el.role)
      : flexer.roles.filter((el) => requestedRoles.includes(el.role));

  const latitude = lat
    ? Number(lat)
    : Number(flexer.preferredLocation.latitude);
  const longitude = long
    ? Number(long)
    : Number(flexer.preferredLocation.longitude);
  const circleRadius = radius
    ? Number(radius)
    : flexer.preferredLocation.radius;
  const metUnit = metricUnit ?? flexer.preferredLocation.metricUnit;

  const blacklistedBy = await findAllBlacklistingAFlexer(flexer);

  const allFlexerJobs = await findAllFlexerJobs(flexer);

  // ================================================================

  return findNonClashingAvailablePostings({
    allFlexerJobs,
    blacklistedBy,
    rolesToSearch,
    employerIds,
    latitude,
    longitude,
    metUnit,
    circleRadius,
    limit: paginationOptions.limit,
    skip: paginationOptions.skip,
  });

  // const conditions = { $and: [] };

  /*  const blacklistedBy = await findAllBlacklistingAFlexer();

    blacklistedBy.forEach((item) => {
      conditions["$and"].push({ "employer.id": { $ne: item.employer } });
    });

    const allFlexerJobs = await findAllFlexerJobs(flexer); */

  /*
   * fixme:
   *  should i check for same shift with more numbers or
   *  same starting time guard is enough */
  // allFlexerJobs.forEach((job) => {
  //   if (job.status === "booked") {
  //     const temp = [
  //       {
  //         $and: [
  //           { startTime: { $gt: new Date() } },
  //           { startTime: { $gt: job.clockOut } },
  //           { endTime: { $gt: job.clockOut } },
  //         ],
  //       },
  //       {
  //         $and: [
  //           { startTime: { $gt: new Date() } },
  //           { startTime: { $lt: job.clockIn } },
  //           { endTime: { $lt: job.clockIn } },
  //         ],
  //       },
  //     ];
  //
  //     conditions["$and"].push({ $or: temp }, { _id: { $ne: job.posting._id } });
  //   } else {
  //     conditions["$and"].push({ _id: { $ne: job.posting._id } });
  //   }
  // });

  // //////////////// filters from frontend ////////////////////////////////

  /* if (requestedRole?.length > 0) {
    const allowedRoles = flexer.role.filter((el) => requestedRole.includes(el.role));
    conditions["$and"].push({ role: { $in: allowedRoles } });
  } else {
    const flexerRoles = flexer.roles.flatMap((el) => el.role);
    conditions["$and"].push({ role: { $in: flexerRoles } });
  } */

  /* const coordinates =
    long && lat
      ? [Number(long), Number(lat)]
      : [
          Number(flexer.preferredLocation.longitude),
          Number(flexer.preferredLocation.latitude),
        ];
  const jobDistance = radius ? Number(radius) : flexer.preferredLocation.radius;
  const metUnit = metricUnit ?? flexer.preferredLocation.metricUnit;
  const radOfEarth = metUnit === "miles" ? 3963.2 : 6378.1; */

  /* conditions["$and"].push({
    location: {
      $geoWithin: {
        $centerSphere: [coordinates, jobDistance / radOfEarth],
      },
    },
  }); */

  /* if (employerId) {
    conditions["$and"].push({ employer: { $in: employerId } });
  } */

  /* conditions["$and"].push(
    { flexerQuantity: { $gt: 0 } },
    { public: { $eq: true } }
  ); */

  // const postings = await findAllPostings(conditions, options);
}

export async function cancelPosting(posting) {
  await deleteOnePostingById(posting._id);
}

export async function increaseFlexerQuantityForPosting(posting) {
  return increaseFlexerQuantityByOne(posting);
}

export async function decreaseFlexerQuantityForPosting(posting) {
  return decreaseFlexerQuantityByOne(posting);
}
