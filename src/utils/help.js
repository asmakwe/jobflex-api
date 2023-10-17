import ROLES from "../constants/app-roles.js";

export function isNotValidRole(role) {
  return !ROLES.includes(role);
}

export function isFlexerVerifiedForRole(flexerRoles, roleToCheck) {
  return flexerRoles?.some((item) => item.role === roleToCheck);
}

export function isPostingAvailableForViewing(posting) {
  return (
    posting.public && !!posting.flexerQuantity && posting.startTime > new Date()
  );
}

export function isNotJobOwner(flexer, job) {
  return flexer._id.toString() !== job.flexer.toString();
}

export function isNotPostingOwner(employer, posting) {
  return employer._id.toString() !== posting.employer.id.toString();
}

export function isJobUnavailableForViewing(job) {
  return (
    job.status !== "booked" &&
    (job.clockIn < new Date() || !job.posting.flexerQuantity)
  );
}

/*
 * true if av
 * booked future
 * booked past
 * applied future
 * offered future
 *
 *
 * false if not av
 * applied old
 * offered old
 * */

export function isBookedJobsGoingToClash(bookedJobs, startTime, endTime) {
  return bookedJobs?.some((job) => {
    const startClash = !(job.clockIn < startTime && job.clockOut < startTime);
    const endClash = !(job.clockIn > endTime && job.clockOut > endTime);

    return startClash || endClash;
  });
}
