import EmailPassword from "supertokens-node/recipe/emailpassword/index.js";
import Session from "supertokens-node/recipe/session/index.js";
import Dashboard from "supertokens-node/recipe/dashboard/index.js";
import UserRoles from "supertokens-node/recipe/userroles/index.js";
import httpStatus from "http-status";
import config from "../config/index.js";
import ApiError from "../utils/api-error.js";
import { createEmployer } from "../features/employer/employer.service.js";
import { createFlexer } from "../features/flexer/flexer-service.js";

function customSendEmail(originalImplementation) {
  return {
    ...originalImplementation,
    async sendEmail(input) {
      // TODO: run some logic before sending the email
      console.log("sending email");
      await originalImplementation.sendEmail(input);
      // eslint-disable-next-line sonarjs/no-duplicate-string
      console.log("email sent");
      // TODO: run some logic post sending the email
    },
  };
}

function customSignUpFunction(originalImplementation) {
  return {
    ...originalImplementation,
    async signUp(input) {
      const response = await originalImplementation.signUp(input);

      if (response.status === "OK" && response.user.loginMethods.length === 1) {
      }
    },
  };
}

function customSignUpApi(originalImplementation) {
  return {
    ...originalImplementation,
    async signUpPOST(input) {
      if (originalImplementation.signUpPOST === undefined) {
        throw new Error("Should never come here, lol");
      }

      const inputFields = Object.fromEntries(
        input.formFields.map((v) => [v.id, v.value])
      );

      if (inputFields.password !== inputFields.confirmPassword) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Passwords do not match");
      }

      const createAuthProfile = inputFields.isEmployer
        ? createEmployer
        : createFlexer;

      const response = await originalImplementation.signUpPOST(input);

      if (response.status === "OK") {
        const { email, id } = response.user;

        try {
          await createAuthProfile({ email, authId: id });
          console.log("Flexer created");
        } catch (error) {
          console.log("Error while creating account for:", email);
          console.log(error);
          // todo delete/rollack user in supertoken db
          throw error;
        }
      }
      return response;
    },
  };
}

export const customCSP = {
  "script-src": [
    "'self'",
    "'unsafe-inline'",
    "https://cdn.jsdelivr.net/gh/supertokens/",
  ],
  "img-src": [
    "'self'",
    "'unsafe-inline'",
    "https://cdn.jsdelivr.net/gh/supertokens/",
  ],
};

export const SuperTokensConfig = {
  framework: "express",
  supertokens: {
    connectionURI: config.supertokensUri,
    apiKey: config.supertokensApiKey,
  },
  appInfo: {
    appName: config.appName,
    apiDomain: `${config.apiUrl}:${config.port}`,
    websiteDomain: "http://localhost:9001",
    apiBasePath: "/auth",
    websiteBasePath: "/auth",
  },
  recipeList: [
    EmailPassword.init({
      override: {
        apis: customSignUpApi,
      },
      signUpFeature: {
        formFields: [
          {
            id: "confirmPassword",
          },
          {
            id: "isEmployer",
          },
        ],
      },
    }),
    Session.init(),
    Dashboard.init(),
    UserRoles.init(),
  ],
};
