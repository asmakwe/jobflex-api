/* eslint-disable dot-notation */
/* eslint-disable unicorn/no-array-for-each */
import httpStatus from "http-status";
import ApiError from "../../utils/api-error.js";
import {addFlexerRole, createNewFlexer, findOneFlexerByAuthId, findOneFlexerByEmail,} from "./flexer-repository.js";
import {isNotValidRole} from "../../utils/help.js"; // done

// done
// after signup
export async function createFlexer(data) {
  /*
  fixme
   may remove line below as supertokens does not allow duplicates
   */
  const flexer = await findOneFlexerByEmail(data.email);

  if (flexer) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Invalid");
  }

  return createNewFlexer(data);
}

// done
export async function getPermittedFlexerByAuthId(authId, flexerId) {
  const flexer = await findOneFlexerByAuthId(authId);

  if (!flexer) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Kindly sign in to continue");
  }

  if (flexerId && flexer._id.toString() !== flexerId) {
    throw new ApiError(httpStatus.FORBIDDEN, "Invalid");
  }

  return flexer;
}

export async function updateFlexerRoles(flexer, role) {
  // todo should have action to remove roles as well
  if (isNotValidRole(role)) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Invalid action");
  }

  /*
  not needed as using addToSet from mongo treats
  the underlying array in document as set,
  therefore ignore when present

  if (isFlexerVerifiedForRole(flexer.roles, role)) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Flexer is already verified for this role"
    );
  } */

  return addFlexerRole(flexer, role);
}

// done
// jobflex.io/flexers/flexerId/work-pref
/*
export async function updateFlexerWorkerDistance(flexer, flexerId, data) {
  // todo: any checks?

  /!*
  * {
    preferredLocation: {
      longitude: body.longitude,
      latitude: body.latitude,
      distance: body.distance,
      metricUnit: body.metricUnit,
    },
  }
  * *!/

  if (flexer._id.toString() !== flexerId) {
    throw new ApiError(httpStatus.FORBIDDEN, "Invalid");
  }

  return updateOneFlexer(flexer._id, data);
}
*/
