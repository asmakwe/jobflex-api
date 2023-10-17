import mongoose from "mongoose";

const networkSchema = new mongoose.Schema({
  employer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Employer",
    required: true,
  },
  flexer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Flexer",
    required: true,
  },
  type: {
    type: String,
    enum: ["whitelist", "blacklist"],
    required: true,
  },
});

const Network = mongoose.model("Network", networkSchema);

export default Network;
