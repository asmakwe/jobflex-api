import express from "express";
import { verifySession } from "supertokens-node/lib/build/recipe/session/framework/express.js";

const jobRoute = express.Router();

jobRoute.use(verifySession());
// jobRoute.route("/:jobId").get(httpGetJob).patch(httpActionOnJob);

/*
 * allowed job actions by flexer
 *
 * book
 * confirm
 * cancel
 * clock-in
 * clock-out
 * edit timesheet if timesheet not yet approved by employer */

export default jobRoute;

/*
 * jobs/ get and create a posting
 *
 * jobs/jobId/ get, apply, book, confirm, approve and delete a posting posting
 *
 * jobs/jobId/
 *
 *
 * */
