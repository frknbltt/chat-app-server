import Joi, { ValidationResult } from "joi";

export const addFriendValidation = (data: any): ValidationResult<any> => {
  const joiUserSchema = Joi.object({
    fromId: Joi.string().required(),
    toEmail: Joi.string().required(),
  })
    .min(2)
    .max(2);

  return joiUserSchema.validate(data);
};
export const getFriendsValidation = (data: any): ValidationResult<any> => {
  const joiUserSchema = Joi.object({
    userId: Joi.string().required(),
  })
    .min(1)
    .max(1);

  return joiUserSchema.validate(data);
};
export const setProfilIMGValidation = (data: any): ValidationResult<any> => {
  const joiUserSchema = Joi.object({
    userId: Joi.string().required(),
    img: Joi.string().required(),
  })
    .min(2)
    .max(2);

  return joiUserSchema.validate(data);
};
export const loginUserValidation = (data: any): ValidationResult<any> => {
  const joiUserSchema = Joi.object({
    password: Joi.string().required(),
    email: Joi.string(),
    username: Joi.string(),
  })
    .min(2)
    .max(2);

  return joiUserSchema.validate(data);
};
export const createUserValidation = (data: any): ValidationResult<any> => {
  const joiUserSchema = Joi.object({
    password: Joi.string().required(),
    email: Joi.string().required(),
    username: Joi.string().required(),
  })
    .min(3)
    .max(3);

  return joiUserSchema.validate(data);
};
export const getMessagesValidation = (data: any): ValidationResult<any> => {
  const joiUserSchema = Joi.object({
    from: Joi.string().required(),
    to: Joi.string().required(),
  })
    .min(2)
    .max(2);

  return joiUserSchema.validate(data);
};
export const addMessageValidation = (data: any): ValidationResult<any> => {
  const joiUserSchema = Joi.object({
    from: Joi.string().required(),
    to: Joi.string().required(),
    message: Joi.string().required(),
  })
    .min(3)
    .max(3);

  return joiUserSchema.validate(data);
};
