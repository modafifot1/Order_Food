import createHttpError from "http-errors";
import Mongoose from "mongoose";
import {
  getPaymentCode,
  confirmPaymentCode,
  distanceBetween2Points,
  getShipmentFee,
} from "../utils";
import { CartItem, Order, OrderItem, OrderStatus } from "../models";
import { envVariables, geocoder } from "../configs";
import { response } from "express";
const { my_address } = envVariables;
/**
 * @api {get} /api/v1/orders Get list order by userId
 * @apiName Get list order
 * @apiGroup Order
 * @apiHeader {String} Authorization The token can be generated from your user profile.
 * @apiHeaderExample {Header} Header-Example
 *      "Authorization: Bearer AAA.BBB.CCC"
 * @apiSuccess {Number} status <code> 200 </code>
 * @apiSuccess {String} msg <code>Get list orders sucessfully</code> if everything went fine.
 * @apiSuccess {Array} cartItems <code> List the orders <code>
 * @apiSuccessExample {json} Success-Example
 *     HTTP/1.1 200 OK
 *        {
 *           "status": 200,
 *           "msg": "Get list order sucessfully!",
 *           "orders": [
 *               {
 *                   "_id": "607ee38c5061c506d4604111",
 *                   "customerId": "607b99348f2d3500151f091d",
 *                   "address": "62/07 Đồng Kè, Liên Chiểu, Đà Năng",
 *                   "total": 278000,
 *                   "statusId": 0,
 *                   "createAt": "2021-04-20T14:22:04.994Z",
 *                   "__v": 0
 *               },
 *               {
 *                   "_id": "607f895a5e06da3054bacbc3",
 *                   "customerId": "607b99348f2d3500151f091d",
 *                   "address": "Hue",
 *                   "total": 128000,
 *                   "statusId": 0,
 *                   "createAt": "2021-04-21T02:09:30.509Z",
 *                   "__v": 0
 *               }
 *           ]
 *       }
 * @apiErrorExample Response (example):
 *     HTTP/1.1 400
 *     {
 *       "status" : 400,
 *       "msg": "Role is invalid"
 *     }
 */
const getListOrder = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const orders = await Order.find({ customerId: userId });
    orders.map((x) => {
      return {
        _id: x._id,
        createAt: x.createAt,
        statusId: x.statusId,
        total: x.total,
      };
    });
    res.status(200).json({
      status: 200,
      msg: "Get list order sucessfully!",
      orders,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
/**
 * @api {get} /api/v1/orders/:orderId Get order by orderId
 * @apiName Get order by orderId
 * @apiGroup Order
 * @apiHeader {String} Authorization The token can be generated from your user profile.
 * @apiHeaderExample {Header} Header-Example
 *      "Authorization: Bearer AAA.BBB.CCC"
 * @apiSuccess {Number} status <code> 200 </code>
 * @apiSuccess {String} msg <code>Get list orders sucessfully</code> if everything went fine.
 * @apiSuccess {ObjectId} _id order's id
 * @apiSuccess {String} address customer's address
 * @apiSuccess {int} total order's total price
 * @apiSuccess {String} orderStatus order's status
 * @apiSuccess {Date} createAt purchase date
 * @apiSuccess {Array} orderItems List object of order items
 * @apiSuccess {Array} cartItems <code> List the orders <code>
 * @apiSuccessExample {json} Success-Example
 *          {
 *              "status": 200,
 *              "msg": "Get order successfully!",
 *              "_id": "607ee38c5061c506d4604111",
 *              "address": "62/07 Đồng Kè, Liên Chiểu, Đà Năng",
 *              "total": 278000,
 *              "orderStatus": "Chờ xác nhận",
 *              "createAt": "2021-04-20T14:22:04.994Z",
 *              "orderItems": [
 *                  {
 *                      "_id": "607ee38d5061c506d4604112",
 *                      "quantity": 4,
 *                      "foodId": "6076c317ebb733360805137a",
 *                      "name": "Orange juice",
 *                      "unitPrice": 40000,
 *                      "discountOff": 20
 *                  },
 *                  {
 *                      "_id": "607ee38d5061c506d4604113",
 *                      "quantity": 3,
 *                      "foodId": "607d81b6e141e742289e2ecf",
 *                      "name": "Gà sốt me",
 *                      "unitPrice": 50000
 *                  }
 *              ]
 *          }
 * @apiErrorExample Response (example):
 *     HTTP/1.1 400
 *     {
 *       "status" : 400,
 *       "msg": "Role is invalid"
 *     }
 */
const getOrderById = async (req, res, next) => {
  try {
    const orderId = req.params.orderId;
    const order = await Order.aggregate([
      {
        $lookup: {
          from: "OrderItem",
          localField: "_id",
          foreignField: "orderId",
          as: "items",
        },
      },
      {
        $match: {
          _id: Mongoose.Types.ObjectId(orderId),
        },
      },
    ]);
    let orderItems = await OrderItem.aggregate([
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
          _id: {
            $in: order[0].items.map((x) => {
              return Mongoose.Types.ObjectId(x._id);
            }),
          },
        },
      },
    ]);
    orderItems = orderItems.map((x) => {
      return {
        _id: x._id,
        quantity: x.quantity,
        foodId: x.foodId,
        name: x.detail[0].name,
        unitPrice: x.detail[0].unitPrice,
        discountOff: x.detail[0].discountOff,
        discountMaximum: x.detail[0].discountMaximum,
        description: x.detail[0].description,
      };
    });
    let status = await OrderStatus.findOne({ id: order[0].statusId });
    status = status.description;
    res.status(200).json({
      status: 200,
      msg: "Get order successfully!",
      _id: order[0]._id,
      address: order[0].address,
      total: order[0].total,
      orderStatus: status,
      createAt: order[0].createAt,
      orderItems,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
/**
 * @api {post} /api/v1/orders Create new order
 * @apiName Create new order
 * @apiGroup Order
 * @apiParam {String} address customer's address
 * @apiParam {Array} cartItems list id of cart items in order
 * @apiParam {String} paymentMethod The way user can pay for order
 * @apiHeader {String} Authorization The token can be generated from your user profile.
 * @apiHeaderExample {Header} Header-Example
 *      "Authorization: Bearer AAA.BBB.CCC"
 * @apiSuccess {Number} status <code> 201 </code>
 * @apiSuccess {String} msg <code>Create new order successfully</code> if everything went fine.
 * @apiSuccess {Int} shipmentFee the shipment fee of order
 * @apiSuccess {Int} merchandiseSubtotal The total of merchandise
 * @apiSuccess {Int} paymentMethod Th way user can pay for order
 * @apiSuccessExample {json} Success-Example
 *     HTTP/1.1 201 OK
 *        {
 *           "status": 200,
 *           "msg": "Create new order successfully!",
 *       }
 * @apiErrorExample Response (example):
 *     HTTP/1.1 400
 *     {
 *       "status" : 400,
 *       "msg": "Role is invalid"
 *     }
 */
const order = async (req, res, next) => {
  try {
    let { address, cartItems, paymentMethod } = req.body;
    const customerCoordinate = await geocoder.geocode(address);
    const myCoordinate = await geocoder.geocode(my_address);
    const distance = distanceBetween2Points(
      customerCoordinate[0].latitude,
      customerCoordinate[0].longitude,
      myCoordinate[0].latitude,
      myCoordinate[0].longitude
    );
    const shipmentFee = getShipmentFee(distance);
    cartItems = cartItems.map((x) => {
      return Mongoose.Types.ObjectId(x);
    });
    let foods = await CartItem.aggregate([
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
          _id: {
            $in: cartItems,
          },
        },
      },
    ]);
    let merchandiseSubtotal = foods.reduce((init, cur) => {
      return (
        init +
        calculatePrice(
          cur.detail[0].unitPrice,
          cur.quantity,
          cur.detail[0].discountOff,
          cur.detail[0].discountMaximum
        )
      );
    }, 0);
    res.status(200).json({
      status: 200,
      msg: "Order successfully!",
      shipmentFee,
      merchandiseSubtotal,
      paymentMethod,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
/**
 * @api {post} /api/v1/orders/purchase Purchase order
 * @apiName Purchase order
 * @apiGroup Order
 * @apiParam {String} address customer's address
 * @apiParam {Array} cartItems list id of cart items in order
 * @apiParam {String} paymentMethod The way user can pay for order
 * @apiParam {Int} shipmentFee The shiment fee of order
 * @apiParam {Int} merchandiseSubtotal the total of merchandise
 * @apiHeader {String} Authorization The token can be generated from your user profile.
 * @apiHeaderExample {Header} Header-Example
 *      "Authorization: Bearer AAA.BBB.CCC"
 * @apiSuccess {Number} status <code> 201 </code>
 * @apiSuccess {String} msg <code>Create Purchase successfully</code> if everything went fine.
 * @apiSuccessExample {json} Success-Example
 *     HTTP/1.1 201 OK
 *        {
 *           "status": 200,
 *           "msg": "Purchase successfully!",
 *       }
 * @apiErrorExample Response (example):
 *     HTTP/1.1 400
 *     {
 *       "status" : 400,
 *       "msg": "Role is invalid"
 *     }
 */
const purchase = async (req, res, next) => {
  try {
    const customerId = req.user._id;
    let {
      address,
      cartItems,
      paymentMethod,
      merchandiseSubtotal,
      shipmentFee,
    } = req.body;
    cartItems = cartItems.map((x) => {
      return Mongoose.Types.ObjectId(x);
    });
    const newOrder = await Order.create({
      customerId,
      address,
      total: merchandiseSubtotal + shipmentFee,
      statusId: 0,
      paymentMethod,
      merchandiseSubtotal,
      shipmentFee,
    });
    let foods = await CartItem.aggregate([
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
          _id: {
            $in: cartItems,
          },
        },
      },
    ]);
    await CartItem.deleteMany({ _id: { $in: cartItems } });
    let orderItems = foods.map((x) => {
      return {
        foodId: x.foodId,
        quantity: x.quantity,
        orderId: newOrder._id,
      };
    });

    await OrderItem.insertMany(orderItems);
    res.status(201).json({
      status: 201,
      msg: "Purchase successfully!",
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
const calculatePrice = (unitPrice, quantity, discountOff, discountMaximum) => {
  if (discountOff) {
    let discount = (unitPrice * discountOff * quantity) / 100;
    if (discountMaximum && discount > discountMaximum) {
      return unitPrice * quantity - discountMaximum;
    }
    return quantity * unitPrice - discount;
  }
  return unitPrice * quantity;
};
/**
 * @api {delete} /api/v1/orders/:orderId Cancel order
 * @apiName Cancel order
 * @apiGroup Order
 * @apiHeader {String} Authorization The token can be generated from your user profile.
 * @apiHeaderExample {Header} Header-Example
 *      "Authorization: Bearer AAA.BBB.CCC"
 * @apiSuccess {Number} status <code> 200 </code>
 * @apiSuccess {String} msg <code>Cancel order successfully</code> if everything went fine.
 * @apiSuccessExample {json} Success-Example
 *     HTTP/1.1 201 OK
 *        {
 *           "status": 200,
 *           "msg": "Cancel order successfully!",
 *       }
 * @apiErrorExample Response (example):
 *     HTTP/1.1 400
 *     {
 *          "msg": "You can only cancel the order if don't over 5 minutes from ordering",
 *          "status": 400
 *       }
 */
const cancelOrderById = async (req, res, next) => {
  try {
    const orderId = req.params.orderId;
    const order = await Order.findById(orderId);
    console.log(new Date(order.createAt));
    console.log(new Date(Date.now()));
    const duration = Date.now() - new Date(order.createAt).getTime();
    console.log("duration: ", duration);
    if (duration > 5 * 60 * 1000) {
      throw createHttpError(
        400,
        "You can only cancel the order if don't over 5 minutes from ordering"
      );
    }
    await Order.findByIdAndRemove(orderId);
    res.status(200).json({
      status: 200,
      msg: "Cancel order successfully!",
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
/**
 * @api {put} /api/v1/orders/:orderId/statuses Update order Status
 * @apiName Update order status
 * @apiGroup Order
 * @apiParam  {String} code must require when customer paid order.
 * @apiHeader {String} Authorization The token can be generated from your user profile.
 * @apiHeaderExample {Header} Header-Example
 *      "Authorization: Bearer AAA.BBB.CCC"
 * @apiSuccess {Number} status <code> 200 </code>
 * @apiSuccess {String} msg
 * @apiSuccessExample {json} Success-Example
 *     HTTP/1.1 200 OK when confirm order
 *        {
 *           "status": 200,
 *           "msg": "Confirm successfully!",
 *       }
 *    HTTP/1.1 200 OK when ship order
 *        {
 *            "status": 200,
 *            "msg": "Tranfer to ship purchase successfully!"
 *        }
 *    HTTP/1.1 200 OK when paid order
 *        {
 *            "status": 200,
 *            "msg": "Pay for order successfully!"
 *        }
 *    HTTP/1.1 200 OK when Comfirm paid order
 *        {
 *            "status": 200,
 *            "msg": "Confirm paid order successfully!"
 *        }
 * @apiErrorExample Response (example):
 *     HTTP/1.1 400
 *     {
 *          "msg": "You can only cancel the order if don't over 5 minutes from ordering",
 *          "status": 400
 *       }
 */
const updateStatus = async (req, res, next) => {
  try {
    const user = req.user;
    const orderId = req.params.orderId;
    const order = await Order.findById(orderId);
    const { code } = req.body;
    switch (order.statusId) {
      case 0:
        if (user.roleId != 2)
          throw createHttpError(400, "You are not employee");
        await confirmOrderStatus(order, res, next);
        break;
      case 1:
        if (user.roleId != 2)
          throw createHttpError(400, "You are not employee");
        await shipOrderStatus(order, res, next);
        break;
      case 2:
        if (user.roleId != 1)
          throw createHttpError(400, "You are not customer!");
        await paidOrderStatus(order, code, res, next);
        break;
      case 3:
        if (user.roleId != 2)
          throw createHttpError(400, "You are not employee!");
        await confirmPaidOrderStatus(order, res, next);
        break;
      default:
        break;
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
};
const confirmOrderStatus = async (order, res, next) => {
  try {
    await Order.findByIdAndUpdate(order._id, {
      statusId: 1,
    });
    res.status(200).json({
      status: 200,
      msg: "Confirm successfully!",
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
const shipOrderStatus = async (order, res, next) => {
  try {
    await getPaymentCode(order._id, next);
    await Order.findByIdAndUpdate(order._id, {
      statusId: 2,
    });
    res.status(200).json({
      status: 200,
      msg: "Tranfer to ship purchase successfully!",
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
const paidOrderStatus = async (order, code, res, next) => {
  try {
    if (!(await confirmPaymentCode(code, order, next))) {
      throw createHttpError(400, "Payment code is not valid!");
    }
    await Order.findByIdAndUpdate(order._id, {
      statusId: 3,
    });
    res.status(200).json({
      status: 200,
      msg: "Pay for order successfully!",
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
const confirmPaidOrderStatus = async (order, res, next) => {
  try {
    await Order.findByIdAndUpdate(order._id, {
      statusId: 4,
    });
    res.status(200).json({
      status: 200,
      msg: "Confirm paid order successfully!",
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
export const orderController = {
  getListOrder,
  getOrderById,
  order,
  purchase,
  cancelOrderById,
  updateStatus,
};
