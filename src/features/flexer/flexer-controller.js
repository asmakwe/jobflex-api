import httpStatus from "http-status";
import catchAsync from "../../utils/catch-async.js";
import {updateFlexerRoles} from "./flexer-service.js";

/* export const httpUpdateFlexerWorkDistance = catchAsync(async (req, res) => {
  const profileId = req.session?.getuserId();
  const user = await updateFlexerWorkerDistance(profileId, req.body);

  res.status(httpStatus.OK).json({ user });
}); */

export const verifyFlexerRole = catchAsync(async (req, res) => {
  const { flexer } = req.jobflex;
  const { role } = req.body;

  const flexerProfile = await updateFlexerRoles(flexer, role);

  res.status(httpStatus.OK).json({ flexer: flexerProfile });
});

export const getFlexerProfile = catchAsync(async (req, res) => {
  const { flexer } = req.jobflex;
  const { firstName, lastName, minimumRate, roles } = flexer;

  return res.status(httpStatus.OK).json({
    firstName,
    lastName,
    minimumRate,
    roles,
  });
});

export const getMe = catchAsync(async (req, res) => {
  const { flexer } = req.jobflex;

  /* should handle
    if flexer is banned/active
    if flexer profile is complete */

  return res.status(httpStatus.OK).json({
    user: flexer,
  });
});
