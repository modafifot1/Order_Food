import createHttpError from "http-errors";
import { Feedback, Food, replySchema } from "../models";

const addFeedback = async (req, res, next) => {
  try {
    const user = req.user;
    let { numOfStars, content, foodId } = req.body;
    const food = await Food.findById(foodId);
    if (!food) throw createHttpError(404, "The id of food is invalid!");
    let foodNumOfStars = food.numOfStars || 0;
    let numOfFeedbacks = food.numOfFeedbacks || 0;
    foodNumOfStars = foodNumOfStars * numOfFeedbacks;
    numOfFeedbacks++;
    numOfStars = (numOfStars + foodNumOfStars) / numOfFeedbacks;
    await Food.findByIdAndUpdate(foodId, {
      numOfStars,
      numOfFeedbacks,
    });
    await Feedback.create({
      foodId,
      userId: user._id,
      content,
      numOfStars,
    });
    res.status(200).json({
      status: 200,
      msg: "Create feedback successfully!",
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
const reply = async (req, res, next) => {
  try {
    const user = req.user;
    const { feedbackId, content } = req.body;
    const newReply = new replySchema({
      userId: user._id,
      content,
    });
    await Feedback.findByIdAndUpdate(feedbackId, {
      $push: {
        reply: newReply,
      },
    });
    res.status(200).json({
      status: 200,
      msg: "Reply success!",
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
export const feedbackController = {
  addFeedback,
  reply,
};
