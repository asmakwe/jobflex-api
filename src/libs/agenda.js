import { Agenda } from "agenda";
import config from "../config";
import Strings from "../constants/strings.js";
import { handleCancelUnconfirmed } from "../jobs/index.js";

const agenda = new Agenda({
  db: {
    address: config.dbUrl,
    collection: "agendaJobs",
  },
});

agenda
  .on("ready", () => console.log("Agenda started!"))
  .on("error", () => console.log("Agenda connection error!"));

agenda.define(Strings.definitions.CONFIRM_SHIFT, handleCancelUnconfirmed);

agenda.start();

export default agenda;
