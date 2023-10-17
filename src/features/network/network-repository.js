import Network from "./network-model.js";

export async function findOneFlexerBlacklistedByEmployer(employer, flexer) {
  return Network.findOne({
    employer: employer._id,
    flexer: flexer._id,
    type: "blacklist",
  });
}

export async function findAllBlacklistingAFlexer(flexer) {
  return Network.find({
    flexer: flexer._id,
    type: "blacklist",
  }).exec();
}
