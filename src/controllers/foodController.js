import { envVariables } from "../configs";
import { Food } from "../models/FoodModel";
import { uploadSingle } from "../configs";
import createHttpError from "http-errors";
const { perPage } = envVariables;
const getListFoodPerPage = async (req, res, next) => {
  try {
    const page = req.params.page;
    const start = (page - 1) * perPage;
    const foods = await Food.find({}).skip(start).limit(perPage);
    res.status(200).json({
      status: 200,
      msg: "Get food successfully!",
      foods,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
const getFoodById = async (req, res, next) => {
  try {
    const foodId = req.params.foodId;
    const food = Food.findById({ foodId });
    res.status(200).json({
      status: 200,
      msg: "Get food successfully!",
      food,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
const createNewFood = async (req, res, next) => {
  try {
    const { typeId, name, unitPrice } = req.body;
    console.log(req.files[0].path);
    const image = await uploadSingle(req.files[0].path);
    const newFood = await Food.create({
      typeId,
      name,
      unitPrice,
      imageUrl: image.url,
    });
    console.log(image.url);
    res.status(200).json({
      status: 200,
      msg: "Create new food successfully!",
      newFood,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
const updateFoodById = async (req, res, next) => {
  try {
    const { name, unitPrice, typeId } = req.body;
    console.log(req.body);
    const foodId = req.params.foodId;
    const existedFood = await Food.findById(foodId);
    if (!existedFood) {
      throw createHttpError(404, "food id not exist!");
    }
    const newFood = await Food.findByIdAndUpdate(foodId, {
      name,
      unitPrice,
      typeId,
    });
    res.status(200).json({
      status: 200,
      msg: "Update food successfully!",
      food: newFood,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
const deleteFoodById = async (req, res, next) => {
  try {
    const foodId = req.params.foodId;
    const existedFood = await Food.findById(foodId);
    if (!existedFood) {
      throw createHttpError(404, "Food is not found");
    }
    await Food.findByIdAndRemove(foodId);
    res.status(200).json({
      status: 200,
      msg: "Delete food successfully!",
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
export const foodController = {
  getListFoodPerPage,
  getFoodById,
  createNewFood,
  updateFoodById,
  deleteFoodById,
};
