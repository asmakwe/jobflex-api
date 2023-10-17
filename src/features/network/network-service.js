import { findOneFlexerBlacklistedByEmployer } from "./network-repository.js";

export async function getFlexerBlacklistedByEmployer(flexerId, employerId) {
  return findOneFlexerBlacklistedByEmployer("blacklist", flexerId, employerId);
}
