import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    status: {
      type: String,
      enum: ["applied", "booked", "offered"],
      required: true,
    },
    confirmed: {
      type: Boolean,
      default: false,
    },
    posting: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Posting",
      required: true,
    },
    clockIn: {
      type: Date,
      required: true,
    },
    clockOut: {
      type: Date,
      required: true,
    },
    flexer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Flexer",
      required: true,
    },
    earnings: mongoose.Schema.Types.Decimal128,
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    strike: {
      status: Boolean,
      reason: String,
    },
    attended: {
      type: Boolean,
      default: true,
    },
    timeSheetApproved: Boolean,
  },
  {
    timestamps: true,
  }
);

const Job = mongoose.model("Job", jobSchema);

export default Job;
