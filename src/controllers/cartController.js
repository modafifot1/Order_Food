import createHttpError from "http-errors";
import Mongoose from "mongoose";
import { CartItem } from "../models";
/**
 * @api {get} /api/v1/carts Get cart item
 * @apiName Get cart item
 * @apiGroup Cart
 * @apiHeader {String} Authorization The token can be generated from your user profile.
 * @apiHeaderExample {Header} Header-Example
 *      "Authorization: Bearer AAA.BBB.CCC"
 * @apiSuccess {Number} status <code> 200 </code>
 * @apiSuccess {String} msg <code>get list cart item successfully</code> if everything went fine.
 * @apiSuccess {Array} cartItems <code> List cart item page <code>
 * @apiSuccessExample {json} Success-Example
 *     HTTP/1.1 200 OK
 *     {
 *         status: 200,
 *         msg: "get list cart item successfully!",
 *         "cartItems": [
 *            {
 *            "_id": "607d3e2a8ce6ab317096a869",
 *            "foodId": "6076c317ebb733360805137a",
 *            "quantity": 4,
 *            "name": "Orange juice",
 *            "unitPrice": 40000,
 *            "imageUrl": "https://res.cloudinary.com/dacnpm17n2/image/upload/v1618395927/syp4cyw7tjzxddyr8xxd.png"
 *            }
 *          ]
 *     }
 * @apiErrorExample Response (example):
 *     HTTP/1.1 400
 *     {
 *       "status" : 400,
 *       "msg": "Role is invalid"
 *     }
 */
const getListCartItem = async (req, res, next) => {
  try {
    const userId = req.user._id;
    // const cartItems = await CartItem.find({ customerId: userId });
    let cartItems = await CartItem.aggregate([
      {
        $lookup: {
          from: "Food",
          localField: "foodId",
          foreignField: "_id",
          as: "detail",
        },
      },
      {
        $match: {
          customerId: Mongoose.Types.ObjectId(userId),
        },
      },
    ]);
    if (!cartItems[0]) {
      throw createHttpError(404, "Not Found Item");
    }
    console.log(cartItems[0]);
    cartItems = cartItems.map((x) => {
      return {
        _id: x._id,
        foodId: x.foodId,
        quantity: x.quantity,
        name: x.detail[0].name,
        unitPrice: x.detail[0].unitPrice,
        imageUrl: x.detail[0].imageUrl,
        discountOff: x.detail[0].discountOff,
      };
    });
    res.status(200).json({
      status: 200,
      msg: "Get cart item successfully!",
      cartItems,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
/**
 * @api {post} /api/v1/carts Add cart item
 * @apiName Add cart item
 * @apiGroup Cart
 * @apiParam {ObjectId} foodId food's Id
 * @apiParam {int} quantity quantity food
 * @apiHeader {String} Authorization The token can be generated from your user profile.
 * @apiHeaderExample {Header} Header-Example
 *      "Authorization: Bearer AAA.BBB.CCC"
 * @apiSuccess {Number} status <code> 200 </code>
 * @apiSuccess {String} msg <code>Add cart item successfully</code> if everything went fine.
 * @apiSuccessExample {json} Success-Example
 *     HTTP/1.1 200 OK
 *     {
 *         status: 200,
 *         msg: "Add cart item successfully!",
 *     }
 * @apiErrorExample Response (example):
 *     HTTP/1.1 400
 *     {
 *       "status" : 400,
 *       "msg": "Role is invalid"
 *     }
 */
const createNewCartItem = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { foodId, quantity } = req.body;
    const existedCartItem = await CartItem.findOne({
      customerId: userId,
      foodId,
    });
    console.log("exist: ", existedCartItem);
    if (existedCartItem) {
      await CartItem.findByIdAndUpdate(existedCartItem._id, {
        quantity: existedCartItem.quantity + quantity,
      });
    } else {
      await CartItem.create({
        customerId: userId,
        foodId,
        quantity,
      });
    }
    res.status(200).json({
      status: 201,
      msg: "Add cart item successfully!",
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
/**
 * @api {put} /api/v1/carts/:itemId Update cart item by id
 * @apiName Update cart item by Id
 * @apiGroup Cart
 * @apiParam {Array} cartItems array of object. each object consist of _id and quantity
 * @apiParamExample {json} Param example
 * {
 *      cartItems: [
 *        {
 *          "_id": "607faeb5d35ea403f0328a38",
 *          "quantity": 3
 *        }
 *      ]
 * }
 *
 * @apiHeader {String} Authorization The token can be generated from your user profile.
 * @apiHeaderExample {Header} Header-Example
 *      "Authorization: Bearer AAA.BBB.CCC"
 * @apiSuccess {Number} status <code> 200 </code>
 * @apiSuccess {String} msg <code>Update cart item successfully</code> if everything went fine.
 * @apiSuccessExample {json} Success-Example
 *     HTTP/1.1 200 OK
 *     {
 *         status: 200,
 *         msg: "Update cart item successfully!",
 *     }
 * @apiErrorExample Response (example):
 *     HTTP/1.1 400
 *     {
 *       "status" : 400,
 *       "msg": "Role is invalid"
 *     }
 */
const updateCartItem = async (req, res, next) => {
  try {
    const { cartItems } = req.body;
    const cartItem = await Promise.all(
      cartItems.map((x) => {
        console.log("_id: ", x._id);
        return CartItem.findByIdAndUpdate(x._id, {
          quantity: x.quantity,
        });
      })
    );
    if (!cartItem) {
      throw createHttpError(404, "Not found item");
    }
    res.status(200).json({
      status: 200,
      msg: "Update cart item successfully!",
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
/**
 * @api {delete} /api/v1/carts/:itemId Delete cart item
 * @apiName Delete cart item
 * @apiGroup Cart
 * @apiParam {array} cartItems list id of cart item
 * @apiParamExample {json} param example
 * {
 *    "cartItems" :[
 *        "607faeb5d35ea403f0328a38"
 *    ]
 * }
 * @apiHeader {String} Authorization The token can be generated from your user profile.
 * @apiHeaderExample {Header} Header-Example
 *      "Authorization: Bearer AAA.BBB.CCC"
 * @apiSuccess {Number} status <code> 200 </code>
 * @apiSuccess {String} msg <code>Delete cart item successfully</code> if everything went fine.
 * @apiSuccessExample {json} Success-Example
 *     HTTP/1.1 200 OK
 *     {
 *         status: 200,
 *         msg: "Delete cart item successfully!",
 *     }
 * @apiErrorExample Response (example):
 *     HTTP/1.1 400
 *     {
 *       "status" : 400,
 *       "msg": "Role is invalid"
 *     }
 */
const deleteCartItem = async (req, res, next) => {
  try {
    const { cartItems } = req.body;
    console.log(cartItems);
    const cartItem = await CartItem.deleteMany({
      _id: {
        $in: cartItems,
      },
    });
    if (!cartItem) {
      throw createHttpError(404, "Not found item");
    }
    res.status(200).json({
      status: 200,
      msg: "Delete cart itme successfully",
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
const deleteAllCartItem = async (req, res, next) => {
  try {
    const userId = req.user._id;
    await CartItem.remove({ customerId: userId });
    res.status(200).json({
      status: 200,
      msg: "Delete all cart items successfully!",
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
export const cartController = {
  getListCartItem,
  createNewCartItem,
  deleteCartItem,
  updateCartItem,
  deleteAllCartItem,
};
