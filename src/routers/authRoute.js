import { Router } from "express";
import { authController } from "../controllers";
import { validateRequestBody, jwtMiddleware } from "../middlewares";
const { validateRegisterData, validateLoginData } = validateRequestBody;
const { registerCustomer, login, logout } = authController;
const baseUrl = "/api/v1/auth";
export const authRoute = Router();
authRoute
  .route(`${baseUrl}/register-customer`)
  .post(validateRegisterData, registerCustomer);
authRoute.route(`${baseUrl}/login`).post(validateLoginData, login);
authRoute.route(`${baseUrl}/logout`).post(jwtMiddleware, logout);
