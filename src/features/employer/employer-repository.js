import Employer from "./employer.model.js";

export async function findOneEmployerByAuthId(authId) {
  return Employer.findOne({ authId }).exec();
}

export async function findOneEmployerById(employerId) {
  return Employer.findById(employerId).exec();
}

export async function findOneEmployerByEmail(email) {
  return Employer.findOne({ email }).exec();
}

export async function createNewEmployer(data) {
  const { email, authId } = data;
  return Employer.create({ email, authId });
}

export async function updateAnEmployer(employer, data) {
  return Employer.findByIdAndUpdate(employer._id, data, { new: true });
}
