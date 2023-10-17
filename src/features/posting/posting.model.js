import mongoose from "mongoose";

const postingSchema = new mongoose.Schema(
  {
    uniform: {
      description: {
        type: String,
        // required: true,
      },
      image: String,
    },
    instructions: {
      type: String,
      // required: true,
    },
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
        required: true,
      },
      coordinates: {
        type: [Number],
        required: true,
      },
      address: {
        type: String,
        required: true,
      },
      city: {
        type: String,
        required: true,
      },
      postcode: {
        type: String,
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
      image_url: {
        type: String,
        // required: true,
      },
    },
    role: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      // required: true,
    },
    hourlyPay: {
      type: Number,
      // required: true,
    },
    hourlyHolidayPay: {
      type: Number,
      // required: true,
    },
    skills: [String],
    employer: {
      id: {
        // todo should've just made this a plain string
        type: mongoose.Schema.Types.ObjectId,
        ref: "Employer",
        required: true,
      },
      name: String,
      logo: String,
    },
    hse: {},
    flexerQuantity: {
      type: Number,
      required: true,
    },
    // amountBooked: Number,
    startTime: Date,
    endTime: Date,
    public: {
      type: Boolean,
      default: true,
    },
    offerAsap: Boolean,
    /* shifts: [
                        {
                          startTime: Date,
                          endTime: Date,
                        },
                      ], */
  },
  {
    timestamps: true,
  }
);

const Posting = mongoose.model("Posting", postingSchema);

export default Posting;

/*
 * [p1,p2,p3] */
