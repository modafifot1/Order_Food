import { number } from "joi";
import { Schema, model } from "mongoose";
const feedbackSchema = new Schema({
  foodId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  numOfStars: {
    type: number,
  },
  content: {
    type: String,
  },
});
export const Feedback = model("Feedback", feedbackSchema, "Feedback");
