import mongoose from "mongoose";

// should not be able to do anything on app except profile complete
const flexerSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  authId: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  roles: [
    {
      role: String,
      rating: {
        type: Number,
        default: 5,
        min: 1,
        max: 5,
      },
    },
  ],
  preferredLocation: {
    longitude: {
      type: Number,
      default: -0.127_646_213_958_071_02,
    },
    latitude: {
      type: Number,
      default: 51.507_334_024_168_78,
    },
    address: String,
    city: String,
    postcode: String,
    metricUnit: {
      type: String,
      default: "km",
      enum: ["km", "miles"],
    },
    radius: {
      type: Number,
      default: 100,
    },
  },
  active: Boolean,
  minimumRate: {
    type: Number,
    default: 11,
    min: 10.42,
    max: 30,
  },
});

const Flexer = mongoose.model("Flexer", flexerSchema);

export default Flexer;
