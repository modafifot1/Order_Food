import { Router } from "express";
import { foodController } from "../controllers";
import {
  validateRequestBody,
  validatePermission,
  jwtMiddleware,
} from "../middlewares";
const { validateNewFoodData } = validateRequestBody;
const { checkPermission } = validatePermission;
const {
  getFoodById,
  getListFoodPerPage,
  getFoodByFoodType,
  createNewFood,
  updateFoodById,
  deleteFoodById,
} = foodController;
const baseUrl = "/api/v1/foods";

export const foodRoute = Router();
foodRoute.use(`${baseUrl}`, jwtMiddleware);
foodRoute
  .route(`${baseUrl}/?`)
  .get(checkPermission("FOODS", "View"), getListFoodPerPage);
foodRoute
  .route(`${baseUrl}/:foodType/?`)
  .get(checkPermission("FOODS", "View"), getFoodByFoodType);
foodRoute
  .route(`${baseUrl}`)
  .post(
    jwtMiddleware,
    checkPermission("FOOD", "Create"),
    validateNewFoodData,
    createNewFood
  );
foodRoute
  .route(`${baseUrl}/:foodId`)
  .get(checkPermission("FOOD", "View"), getFoodById);
foodRoute
  .route(`${baseUrl}/:foodId`)
  .put(
    jwtMiddleware,
    checkPermission("FOOD", "Edit"),
    validateNewFoodData,
    updateFoodById
  );
foodRoute
  .route(`${baseUrl}/:foodId`)
  .delete(jwtMiddleware, checkPermission("FOOD", "Delete"), deleteFoodById);
// //----------------------------Voucher-------------------------//
// foodRoute.route(`${baseUrl}/:foodId/vouchers`).get();
// foodRoute.route(`${baseUrl}/:foodId/vouchers`).post();
// foodRoute.route(`${baseUrl}/:foodId/vouchers/:voucherId`).put();
// foodRoute.route(`${baseUrl}/:foodId/vouchers/:voucherId`).delete();
