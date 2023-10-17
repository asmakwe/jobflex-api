import Flexer from "./flexer-model.js";

export async function findOneFlexerById(id) {
  return Flexer.findById(id).exec();
}

export async function findOneFlexerByAuthId(authId) {
  return Flexer.findOne({ authId }).exec();
}

// redundant for now, as supertokens would not allow email duplicates
export async function findOneFlexerByEmail(email) {
  return Flexer.findOne({ email }).exec();
}

export async function updateOneFlexer(flexer) {
  const update = {
    email: flexer.email,
    roles: flexer.roles,
    preferredLocation: flexer.preferredLocation,
    minimumRate: flexer.minimumRate,
  };
  return Flexer.findByIdAndUpdate(flexer._id, update, { new: true });
}

export async function addFlexerRole(flexer, role) {
  return Flexer.findByIdAndUpdate(
    flexer._id,
    {
      $addToSet: { roles: role },
    },
    { new: true }
  );
}

export async function createNewFlexer(data) {
  const { email, authId } = data;
  return Flexer.create({ email, authId });
}
