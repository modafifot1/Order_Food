import { envVariables } from "../configs";
import { Food } from "../models/FoodModel";
import { uploadSingle } from "../configs";
import createHttpError from "http-errors";
const { perPage } = envVariables;
/**
 * @api {get} /api/v1/foods/?page= Get food per page
 * @apiName Get food per page
 * @apiGroup Food
 * @apiHeader {String} token The token can be generated from your user profile.
 * @apiHeaderExample {Header} Header-Example
 *      "Authorization: Bearer AAA.BBB.CCC"
 * @apiSuccess {Number} status <code> 200 </code>
 * @apiSuccess {String} msg <code>get list food per page successfully</code> if everything went fine.
 * @apiSuccess {Array} foods <code> List food per page <code>
 * @apiSuccessExample {json} Success-Example
 *     HTTP/1.1 200 OK
 *     {
 *         status: 200,
 *         msg: "get list food successfully!",
 *         foods:[
 *       {
 *           "_id": "6076c317ebb733360805137a",
 *           "typeId": 1,
 *           "name": "Orange juice",
 *           "unitPrice": 40000,
 *           "imageUrl": "https://res.cloudinary.com/dacnpm17n2/image/upload/v1618395927/syp4cyw7tjzxddyr8xxd.png",
 *           "createAt": "2021-04-14T10:25:27.376Z",
 *           "__v": 0
 *       }
 *  ]
 *     }
 * @apiErrorExample Response (example):
 *     HTTP/1.1 400
 *     {
 *       "status" : 400,
 *       "msg": "Role is invalid"
 *     }
 */
const getListFoodPerPage = async (req, res, next) => {
  try {
    const page = req.query.page;
    console.log(page);
    const start = (page - 1) * perPage;
    const foods = await Food.find({}).skip(start).limit(perPage);
    res.status(200).json({
      status: 200,
      msg: "Get foods successfully!",
      foods,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
/**
 * @api {get} /api/v1/foods/:fooId Get food by foodId
 * @apiName Get food by foodId
 * @apiGroup Food
 * @apiHeader {String} token The token can be generated from your user profile.
 * @apiHeaderExample {Header} Header-Example
 *      "Authorization: Bearer AAA.BBB.CCC"
 * @apiSuccess {Number} status <code> 200 </code>
 * @apiSuccess {String} msg <code>get food by id successfully</code> if everything went fine.
 * @apiSuccess {object} food <code> List food per page <code>
 * @apiSuccessExample {json} Success-Example
 *     HTTP/1.1 200 OK
 *     {
 *         status: 201,
 *         msg: "get food successfully!",
 *         food:
 *           "_id": "6076c317ebb733360805137a",
 *           "typeId": 1,
 *           "name": "Orange juice",
 *           "unitPrice": 40000,
 *           "imageUrl": "https://res.cloudinary.com/dacnpm17n2/image/upload/v1618395927/syp4cyw7tjzxddyr8xxd.png",
 *           "createAt": "2021-04-14T10:25:27.376Z",
 *           "__v": 0
 *     }
 * @apiErrorExample Response (example):
 *     HTTP/1.1 400
 *     {
 *       "status" : 400,
 *       "msg": "Role is invalid"
 *     }
 */
const getFoodById = async (req, res, next) => {
  try {
    const foodId = req.params.foodId;
    console.log("FoodId :", foodId);
    const food = await Food.findById(foodId);
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
/**
 * @api {get} /api/v1/foods/:fooId Get food by foodId
 * @apiName Get food by foodId
 * @apiGroup Food
 * @apiParam {int} typeId type of food
 * @apiParam {String} name name of food
 * @apiParam {int} unitPrice price of food
 * @apiParam {}
 * @apiHeader {String} token The token can be generated from your user profile.
 * @apiHeaderExample {Header} Header-Example
 *      "Authorization: Bearer AAA.BBB.CCC"
 * @apiSuccess {Number} status <code> 200 </code>
 * @apiSuccess {String} msg <code>get food by id successfully</code> if everything went fine.
 * @apiSuccess {object} food <code> List food per page <code>
 * @apiSuccessExample {json} Success-Example
 *     HTTP/1.1 200 OK
 *     {
 *         status: 201,
 *         msg: "get food successfully!",
 *         food:
 *           "_id": "6076c317ebb733360805137a",
 *           "typeId": 1,
 *           "name": "Orange juice",
 *           "unitPrice": 40000,
 *           "imageUrl": "https://res.cloudinary.com/dacnpm17n2/image/upload/v1618395927/syp4cyw7tjzxddyr8xxd.png",
 *           "createAt": "2021-04-14T10:25:27.376Z",
 *           "__v": 0
 *     }
 * @apiErrorExample Response (example):
 *     HTTP/1.1 400
 *     {
 *       "status" : 400,
 *       "msg": "Role is invalid"
 *     }
 */
const createNewFood = async (req, res, next) => {
  try {
    const {
      typeId,
      name,
      unitPrice,
      discountOff,
      description,
      discountMaximum,
    } = req.body;
    console.log(req.files[0].path);
    const image = await uploadSingle(req.files[0].path);
    const newFood = await Food.create({
      typeId,
      name,
      unitPrice,
      imageUrl: image.url,
      discountOff,
      description,
      discountMaximum,
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
    const {
      name,
      unitPrice,
      typeId,
      discountOff,
      description,
      discountMaximum,
    } = req.body;
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
      discountOff,
      description,
      discountMaximum,
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
