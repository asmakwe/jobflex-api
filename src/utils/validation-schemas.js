import Joi from "joi";

export const verifyRolesBodySchema = Joi.object().keys({
  role: Joi.string().required().valid("Waiting Staff", "General Staff"),
});
