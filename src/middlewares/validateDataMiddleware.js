import joi from "joi";
import { Role } from "../models";
import { validateRequest } from "../utils";
const validateRegisterData = async (req, res, next) => {
  try {
    const role = await Role.findOne({ roleName: "customer" });
    const registerSchema = joi.object({
      email: joi.string().email().required(),
      password: joi
        .string()
        .required()
        .min(6)
        .max(50)
        .regex(/(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#\$%\^&\*])(?=.{6,})/),
      roleId: joi.number().integer().required().valid(role.id),
      fullName: joi.string().required(),
      phoneNumber: joi.string().min(10).max(11).pattern(/[0-9]/),
      birthday: joi.date().required(),
    });
    validateRequest(req, registerSchema, next);
  } catch (error) {
    next(error);
  }
};
const validateLoginData = (req, res, next) => {
  try {
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
  } catch (error) {
    next(error);
  }
};
const validateEmployeeData = async (req, res, next) => {
  try {
    const role = await Role.findOne({ roleName: "employee" });
    console.log(JSON.stringify(role));
    const employeeSchema = joi.object({
      email: joi.string().email().required(),
      password: joi
        .string()
        .required()
        .min(6)
        .max(50)
        .regex(/(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#\$%\^&\*])(?=.{6,})/),
      roleId: joi.number().integer().required().valid(role.id),
      fullName: joi.string().required(),
      phoneNumber: joi.string().min(10).max(11).pattern(/[0-9]/),
      birthday: joi.date().required(),
    });
    validateRequest(req, employeeSchema, next);
  } catch (error) {
    next(error);
  }
};
export const validateRequestBody = {
  validateRegisterData,
  validateLoginData,
  validateEmployeeData,
};
