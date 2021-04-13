import { Router } from "express";
import { foodController } from "../controllers";
import { validateRequestBody } from "../middlewares";
const { validateNewFoodData } = validateRequestBody;
const {
  getFoodById,
  getListFoodPerPage,
  createNewFood,
  updateFoodById,
  deleteFoodById,
} = foodController;
const baseUrl = "/api/v1/foods";

export const foodRoute = Router();
foodRoute.route(`${baseUrl}/:page`).get(getListFoodPerPage);
foodRoute.route(`${baseUrl}`).post(validateNewFoodData, createNewFood);
foodRoute.route(`${baseUrl}/:foodId`).get(getFoodById);
foodRoute.route(`${baseUrl}/:foodId`).put(validateNewFoodData, updateFoodById);
foodRoute.route(`${baseUrl}/:foodId`).delete(deleteFoodById);
