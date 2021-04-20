import { Router } from "express";
import { validatePermission, jwtMiddleware } from "../middlewares";
const { checkPermission } = validatePermission;
const baseUrl = "/api/v1/orders";
export const orderRoute = Router();
orderRoute.use(`${baseUrl}`, jwtMiddleware);
orderRoute.route(`${baseUrl}`).post(checkPermission("ORDER", "Create"));
orderRoute.route(`${baseUrl}`).get(checkPermission("ORDER", "View"));
orderRoute.route(`${baseUrl}/:orderId`).get(checkPermission("ORDER", "View"));
