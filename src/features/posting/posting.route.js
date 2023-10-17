import express from "express";

import { verifySession } from "supertokens-node/lib/build/recipe/session/framework/express.js";
import { getPosting, getPostingsForFlexer } from "./posting.controller.js";
import { isEmployer, isFlexer } from "../../middlewares/auth.middleware.js";
import {
  employerActionOnJob,
  newJob,
  offer,
  postingJobs,
} from "../job/job.controller.js";

const postingRoute = express.Router();

postingRoute.patch(
  "/:postingId/jobs/:jobId/:action",
  isEmployer,
  employerActionOnJob
);
postingRoute.delete("/:postingId/jobs/:jobId", isEmployer, employerActionOnJob);

postingRoute.get("/:postingId/jobs", isEmployer, postingJobs); // ok for employer only
postingRoute.post("/:postingId/offer", isEmployer, offer); // ok for employer only

postingRoute.use(verifySession());

postingRoute.post("/:postingId/jobs", isFlexer, newJob);

postingRoute.get("/", isFlexer, getPostingsForFlexer); // done

// jobflex.io/postings/postingId
postingRoute.get("/:postingId", isFlexer, getPosting); // done

export default postingRoute;
