import { number } from "joi";
import { Schema, model } from "mongoose";
const foodSchema = new Schema({
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
  numOfStars: {
    type: Number,
  },
  numOfFeedback: {
    type: Number,
  },
  confirmed: {
    type: Boolean,
    required: true,
    default: false,
  },
});
foodSchema.index({ name: "text" });
export const Food = model("Food", foodSchema, "Food");
