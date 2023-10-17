import { removeHours } from "../utils/helper.js";
import Strings from "../constants/strings.js";
import agenda from "../libs/agenda.js";

function flexJobTaskScheduler(agendaInstance) {
  return {
    addCancelUnconfirmed: async function cancelUnconfirmed(flexJob) {
      await agendaInstance.schedule(
        removeHours(flexJob.clockIn, 24),
        Strings.definitions.CONFIRM_SHIFT,
        flexJob._id
      );
    },
    deleteAllTasks: {},
  };
}

export default flexJobTaskScheduler(agenda);
