import express from "express";
import { updateProfile } from "./employer.controller.js";
import { isEmployer } from "../../middlewares/auth.middleware.js";
import {
  createPosting,
  deletePosting,
  getPosting,
  getPostingsForEmployer,
} from "../posting/posting.controller.js";

const employerRoute = express.Router();

// employerRoute.use(verifySession());

employerRoute.use(isEmployer);

employerRoute.patch("/:employerId/", updateProfile);

employerRoute.post("/:employerId/postings", createPosting);

employerRoute.get("/:employerId/postings", getPostingsForEmployer);

employerRoute.get("/:employerId/postings/:postingId", getPosting);

// employerRoute.patch("/:employerId/postings/:postingId");

employerRoute.delete("/:employerId/postings/:postingId", deletePosting);

export default employerRoute;
