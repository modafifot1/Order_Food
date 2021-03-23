import { Router } from "express";
import { registerCustomer } from "../controllers";
export const authRoute = Router();
authRoute.route("/api/v1/auth/register-customer").post(registerCustomer);
