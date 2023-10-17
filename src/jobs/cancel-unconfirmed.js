import { removeHours } from "../utils/helper.js";
import Strings from "../constants/strings.js";
import { cancelUnconfirmedShifts } from "../features/job/job.service.js";

export async function handleCancelUnconfirmed(job, done) {
  const { jobId } = job.attrs.data;
  try {
    const flexJob = await cancelUnconfirmedShifts(jobId);
    if (flexJob.strike.status) {
      // send strike email
      // notif
      done();
    }
  } catch (error) {
    console.log("Error in confirm shift handler", error);
    done(error);
  }
}

export async function scheduleCancelUnconfirmed(agenda, flexJob) {
  await agenda.schedule(
    removeHours(flexJob.clockIn, 24),
    Strings.definitions.CONFIRM_SHIFT,
    flexJob._id
  );
}
