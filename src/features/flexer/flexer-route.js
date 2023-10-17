import express from "express";
import {verifySession} from "supertokens-node/lib/build/recipe/session/framework/express.js";
import {getFlexerProfile, getMe, verifyFlexerRole,} from "./flexer-controller.js";
import {isFlexer} from "../../middlewares/auth.middleware.js";
import {
  bookJobForFlexer,
  cancelJobForFlexer,
  confirmJobForFlexer,
  flexerJob,
  flexerJobs,
} from "../job/job.controller.js";
/*
 * flexer to update
 * times of the day
 * total hours per week
 * distance
 * name/image
 * experience
 * professional summary
 *
 * get network list
 * get roles */

const flexerRoute = express.Router();

flexerRoute.use(verifySession());

flexerRoute.get("/me", isFlexer, getMe);

flexerRoute.get("/:flexerId", isFlexer, getFlexerProfile);

flexerRoute.get("/:flexerId/jobs", isFlexer, flexerJobs);

flexerRoute.get("/:flexerId/jobs/:jobId", isFlexer, flexerJob);

flexerRoute.patch("/:flexerId/jobs/:jobId/book", isFlexer, bookJobForFlexer);

flexerRoute.patch(
  "/:flexerId/jobs/:jobId/confirm",
  isFlexer,
  confirmJobForFlexer
);

flexerRoute.patch(
  "/:flexerId/jobs/:jobId/cancel",
  isFlexer,
  cancelJobForFlexer
);

flexerRoute.patch("/:flexerId/roles", isFlexer, verifyFlexerRole);

// ========================================================================

// time availability
// weekly hrs
// location
// pay rate
// week total and list
// all total and list

export default flexerRoute;
