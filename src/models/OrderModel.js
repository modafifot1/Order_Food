import { Schema, model } from "mongoose";
const orderSchema = new Schema({
  customerId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  employeesId: {
    type: Schema.Types.ObjectId,
  },
  address: {
    type: String,
    required: true,
  },
  total: {
    type: Number,
    required: true,
  },
  createAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
  statusId: {
    type: Number,
  },
  code: {
    type: String,
  },
});
export const Order = model("Order", orderSchema, "Order");
