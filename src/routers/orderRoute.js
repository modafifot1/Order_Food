import { Router } from "express";
import { validatePermission, jwtMiddleware } from "../middlewares";
const { checkPermission } = validatePermission;
const baseUrl = "/api/v1/orders";
export const orderRoute = Router();
orderRoute.route(`${baseUrl}`).post();
orderRoute.route(``);
