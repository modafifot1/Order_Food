import { Schema, model } from "mongoose";
const foodSchema = Schema({
  typeId: {
    type: Number,
    ref: "FoodType",
  },
  name: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  unitPrice: {
    type: Number,
    required: true,
  },
  discountOff: {
    type: Number,
  },
  discountMaximum: {
    type: Number,
  },
  description: {
    type: String,
  },
  createAt: {
    type: Date,
    default: Date.now,
  },
  updateAt: {
    type: Date,
  },
});
export const Food = model("Food", foodSchema, "Food");
