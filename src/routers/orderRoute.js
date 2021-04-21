import { Router } from "express";
import { validatePermission, jwtMiddleware } from "../middlewares";
import { orderController } from "../controllers";
const { checkPermission } = validatePermission;
const {
  getListOrder,
  getOrderById,
  createNewOrder,
  cancelOrderById,
} = orderController;
const baseUrl = "/api/v1/orders";
export const orderRoute = Router();
orderRoute.use(`${baseUrl}`, jwtMiddleware);
orderRoute
  .route(`${baseUrl}`)
  .post(checkPermission("ORDER", "Create"), createNewOrder);
orderRoute
  .route(`${baseUrl}`)
  .get(checkPermission("ORDER", "View"), getListOrder);
orderRoute
  .route(`${baseUrl}/:orderId`)
  .get(checkPermission("ORDER", "View"), getOrderById);
orderRoute
  .route(`${baseUrl}/:orderId`)
  .delete(checkPermission("ORDER", "Delete"), cancelOrderById);
