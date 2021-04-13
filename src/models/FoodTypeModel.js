import { Schema, model } from "mongoose";
const foodTypeSchema = Schema(
  {
    id: {
      type: Number,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
  },
  {
    _id: false,
  }
);
export const FoodType = model("FoodType", foodTypeSchema, "FoodType");