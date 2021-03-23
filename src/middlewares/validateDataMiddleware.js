import joi from "joi";
import { Schema } from "mongoose";
import { validateRequest } from "../utils";
const validateRegisterData = (req, res, next) => {
  const registerSchema = joi.object({
    email: joi.string().email().required(),
    password: joi
      .string()
      .required()
      .min(6)
      .max(50)
      .regex(/(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#\$%\^&\*])(?=.{6,})/),
    roleId: joi.number().integer().required(),
    fullName: joi.string().required(),
    phoneNumber: joi.string().min(10).max(11).pattern(/[0-9]/),
    birthday: joi.date().required(),
  });
  validateRequest(req, registerSchema, next);
};
const validateLoginData = (req, res, next) => {
  const loginSchema = joi.object({
    email: joi.string().email().required(),
    password: joi
      .string()
      .required()
      .min(6)
      .max(50)
      .regex(/(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#\$%\^&\*])(?=.{6,})/),
  });
  validateRequest(req, loginSchema, next);
};
export const validateRequestBody = {
  validateRegisterData,
  validateLoginData,
};
