import joi from "joi";
import { FoodType, Role } from "../models";
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
      address: joi.string(),
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
      address: joi.string(),
    });
    validateRequest(req, employeeSchema, next);
  } catch (error) {
    next(error);
  }
};
const validateProfileData = async (req, res, next) => {
  try {
    const profileSchema = joi.object({
      fullName: joi.string().required(),
      phoneNumber: joi.string().min(10).max(11).pattern(/[0-9]/),
      birthday: joi.date().required(),
    });
    validateRequest(req, profileSchema, next);
  } catch (error) {
    console.log(error);
    next(error);
  }
};
const validateNewFoodData = async (req, res, next) => {
  try {
    let foodType = await FoodType.find({});
    foodType = foodType.map((x) => x.id);
    const foodSchema = joi.object({
      typeId: joi
        .number()
        .integer()
        .required()
        .valid(...foodType),
      name: joi.string().max(256).min(1).required(),
      unitPrice: joi.number().integer().min(1000).required(),
      discountOff: joi.number().min(0).max(1),
      description: joi.string().max(1024),
      discountMaximum: joi.number().min(0).max(joi.ref("unitPrice")),
    });
    validateRequest(req, foodSchema, next);
  } catch (error) {
    console.log(error);
    next(error);
  }
};
export const validateRequestBody = {
  validateRegisterData,
  validateLoginData,
  validateEmployeeData,
  validateProfileData,
  validateNewFoodData,
};
