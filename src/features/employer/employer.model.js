import mongoose from "mongoose";

const employerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      // required: true,
    },
    logo: {
      type: String,
      // required: true,
    },
    email: {
      type: String,
      // required: true,
    },
    authId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

const Employer = mongoose.model("Employer", employerSchema);

export default Employer;
