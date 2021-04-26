import { Schema, model } from "mongoose";
export const replySchema = Schema({
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  createAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
});
const feedbackSchema = Schema({
  foodId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  numOfStars: {
    type: Number,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  createAt: {
    type: Date,
    default: Date.now,
  },
  updateAt: {
    type: Date,
    default: Date.now,
  },
  reply: [
    {
      type: replySchema,
    },
  ],
});
export const Feedback = model("Feedback", feedbackSchema, "Feedback");
