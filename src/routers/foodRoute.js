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
  searchFoods,
  filterFood,
} = foodController;
const baseUrl = "/api/v1/foods";

export const foodRoute = Router();
foodRoute.use(`${baseUrl}`, jwtMiddleware);
foodRoute
  .route(`${baseUrl}?`)
  .get(checkPermission("FOODS", "View"), getListFoodPerPage);
foodRoute
  .route(`${baseUrl}/:foodType/?`)
  .get(checkPermission("FOODS", "View"), getFoodByFoodType);
foodRoute
  .route(`${baseUrl}`)
  .post(checkPermission("FOOD", "Create"), validateNewFoodData, createNewFood);
foodRoute
  .route(`${baseUrl}/:foodId`)
  .get(checkPermission("FOOD", "View"), getFoodById);
foodRoute
  .route(`${baseUrl}/:foodId`)
  .put(checkPermission("FOOD", "Edit"), validateNewFoodData, updateFoodById);
foodRoute
  .route(`${baseUrl}/:foodId`)
  .delete(checkPermission("FOOD", "Delete"), deleteFoodById);
foodRoute.route(`${baseUrl}/search`).post(searchFoods);

// .post(checkPermission("SEARCH_FOOD", "View"), searchFoods);
foodRoute.route(`${baseUrl}/search/filter?`).get(filterFood);
// //----------------------------Voucher-------------------------//
// foodRoute.route(`${baseUrl}/:foodId/vouchers`).get();
// foodRoute.route(`${baseUrl}/:foodId/vouchers`).post();
// foodRoute.route(`${baseUrl}/:foodId/vouchers/:voucherId`).put();
// foodRoute.route(`${baseUrl}/:foodId/vouchers/:voucherId`).delete();
