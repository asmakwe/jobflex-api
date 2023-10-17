import express from "express";
import httpStatus from "http-status";
import supertokens from "supertokens-node";
import cors from "cors";
import { errorHandler, middleware } from "supertokens-node/framework/express";
import helmet from "helmet";
import ApiError from "./utils/api-error.js";
import customErrorHandler from "./middlewares/error-middleware.js";
import authRoute from "./features/auth/auth.route.js";
import jobRoute from "./features/job/job.route.js";
import flexerRoute from "./features/flexer/flexer-route.js";
import postingRoute from "./features/posting/posting.route.js";
import employerRoute from "./features/employer/employer.route.js";
import { customCSP, SuperTokensConfig } from "./bootstrap/auth-conn.js";

supertokens.init(SuperTokensConfig);

const app = express();

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        ...helmet.contentSecurityPolicy.getDefaultDirectives(),
        ...customCSP,
      },
    },
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(
  cors({
    origin: "http://localhost:9000",
    allowedHeaders: ["content-type", ...supertokens.getAllCORSHeaders()],
    methods: ["GET", "PUT", "POST", "DELETE"],
    credentials: true,
  })
);

app.use((req, res, next) => {
  console.log("====================");
  console.log({
    method: req.method,
    url: req.url,
  });
  console.log("====================");
  next();
});

// IMPORTANT: CORS should be before the below line.
app.use(middleware());
console.log("middleware ran");

app.get("/", (req, res) => {
  res.status(200).json({
    msg: "Naso",
    wida: "ya eyes",
  });
});

app.use("/auth", authRoute);
app.use("/jobs", jobRoute);
app.use("/flexers", flexerRoute);
app.use("/postings", postingRoute);
app.use("/employers", employerRoute);

app.use((req, res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, "Not found "));
});

// Add this AFTER all your routes
app.use(errorHandler());

// your own error handler
// todo: error logging

// global error handler
app.use(customErrorHandler);

export default app;
