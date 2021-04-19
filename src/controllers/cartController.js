import createHttpError from "http-errors";
import Mongoose from "mongoose";
import { CartItem } from "../models";

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
const createNewCartItem = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { foodId, quantity } = req.body;
    await CartItem.create({
      customerId: userId,
      foodId,
      quantity,
    });
    res.status(200).json({
      status: 201,
      msg: "Create new cart item successfully!",
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
const updateCartItem = async (req, res, next) => {
  try {
    const itemId = req.params.itemId;
    const { quantity } = req.body;
    console.log(quantity);
    const cartItem = await CartItem.findByIdAndUpdate(itemId, {
      quantity,
    });
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
const deleteCartItem = async (req, res, next) => {
  try {
    const itemId = req.params.itemId;
    const cartItem = await CartItem.findOneAndDelete({ _id: itemId });
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

export const cartController = {
  getListCartItem,
  createNewCartItem,
  deleteCartItem,
  updateCartItem,
};
