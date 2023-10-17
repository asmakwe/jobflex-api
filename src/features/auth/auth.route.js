import express from "express";

const authRoute = express.Router();

authRoute.post("/register");
authRoute.post("/login");
authRoute.post("/logout");
authRoute.post("/forgotPassword");
authRoute.post("/resetPassword");

export default authRoute;
