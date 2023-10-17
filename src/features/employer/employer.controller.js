import httpStatus from "http-status";
import catchAsync from "../../utils/catch-async.js";
import { updateAnEmployerProfile } from "./employer.service.js";

export const updateProfile = catchAsync(async (req, res) => {
  const { employer } = req.jobflex;

  const updatedEmployer = await updateAnEmployerProfile(employer, req.body);

  res.status(httpStatus.OK).json({ employer: updatedEmployer });
});

/*
* export const httpCreatePosting = catchAsync(async (req, res) => {
  // middleware validates user as employer
  const {
    role,
    flexerQuantity,
    hourlyPay,
    hourlyHolidayPay,
    longitude,
    latitude,
    postcode,
    city,
    address,
    name,
    // eslint-disable-next-line camelcase
    uniformDescription,
    instructions,
    description,
    skills,
  } = req.body;
  const startTime = new Date("2023-10-23T12:00:00");
  const endTime = new Date("2023-10-23T16:00:00");
  const empId = "64e6470aaff3d4d1d827316d";
  const emp = await Employer.findById(empId);
  const employer = { id: emp._id, logo: emp.logo, name: emp.name };
  const posting = await createPosting({
    startTime,
    endTime,
    employer,
    role,
    flexerQuantity,
    hourlyPay,
    hourlyHolidayPay,
    location: {
      coordinates: [longitude, latitude],
      postcode,
      city,
      address,
      name,
    },
    uniform: { description: uniformDescription },
    instructions,
    description,
    skills,
  });
  console.log("Posting created");

  res.status(httpStatus.CREATED).json({
    posting,
  });
});
*/
