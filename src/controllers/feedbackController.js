import createHttpError from "http-errors";
import Mongoose from "mongoose";
import { Feedback, Food, Reply, UserDetail } from "../models";
/**
 * @api {post} /api/v1/feedbacks Add feebback
 * @apiName Add feebback
 * @apiGroup Feedback
 * @apiParam {String} foodId Food's foodId
 * @apiParam {String} content feedback's content
 * @apiParam {Int} numOfStars feedback's numOfStars
 * @apiHeader {String} Authorization The token can be generated from your user profile.
 * @apiHeaderExample {Header} Header-Example
 *      "Authorization: Bearer AAA.BBB.CCC"
 * @apiSuccess {Number} status <code> 201 </code>
 * @apiSuccess {String} msg <code>Add feedback successfully!</code> if everything went fine.
 * @apiSuccessExample {json} Success-Example
 *     HTTP/1.1 201 OK
 *     {
 *         status: 201,
 *         msg: "Add feedback successfully!",
 *     }
 * @apiErrorExample Response (example):
 *     HTTP/1.1 400
 *     {
 *       "status" : 400,
 *       "msg": "Role is invalid"
 *     }
 */
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
/**
 * @api {post} /api/v1/feedbacks/reply Reply feebback
 * @apiName Reply feebback
 * @apiGroup Feedback
 * @apiParam {String} feedbackId Feedback's feedbackId
 * @apiParam {String} content reply's content
 * @apiHeader {String} Authorization The token can be generated from your user profile.
 * @apiHeaderExample {Header} Header-Example
 *      "Authorization: Bearer AAA.BBB.CCC"
 * @apiSuccess {Number} status <code> 201 </code>
 * @apiSuccess {String} msg <code>reply feedback successfully!</code> if everything went fine.
 * @apiSuccessExample {json} Success-Example
 *     HTTP/1.1 201 OK
 *     {
 *         status: 201,
 *         msg: "reply feedback successfully!",
 *     }
 * @apiErrorExample Response (example):
 *     HTTP/1.1 400
 *     {
 *       "status" : 400,
 *       "msg": "Role is invalid"
 *     }
 */
const reply = async (req, res, next) => {
  try {
    const userDetail = await UserDetail.findOne({ userId: req.user._id });
    const { feedbackId, content } = req.body;
    const newReply = Reply({
      userName: userDetail.fullName,
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
/**
 * @api {get} /api/v1/feedbacks Get all feebbacks
 * @apiName Get all feebbacks
 * @apiGroup Feedback
 * @apiParam {String} foodId Food's id
 * @apiHeader {String} Authorization The token can be generated from your user profile.
 * @apiHeaderExample {Header} Header-Example
 *      "Authorization: Bearer AAA.BBB.CCC"
 * @apiSuccess {Number} status <code> 200 </code>
 * @apiSuccess {String} msg <code>Get all feedbacks successfully!</code> if everything went fine.
 * @apiSussess {Array} feedbacks List of feedbacks
 * @apiSuccessExample {json} Success-Example
 *     HTTP/1.1 200 OK
 *     {
 *         status: 200,
 *         msg: "Get all feedbacks successfully!",
 *         feedbacks: [
 *               {
 *                   "_id": "607bb68228b9b81957c0aa3c",
 *                   "userName": "Nguyen Van B",
 *                   "content": "",
 *                   "numOfStars": 3,
 *                   "reply": [
 *                       {
 *                           "_id": "6093f7772d771f2db023aa7b",
 *                           "userName": "Viet Huynh",
 *                           "content": "Đánh giá 5 sao",
 *                           "createAt": "2021-05-06T14:04:39.726Z"
 *                       }
 *                   ]
 *               },
 *               {
 *                   "_id": "6086337c692e3429b8b8a37a",
 *                   "userName": "Nguyen Van B",
 *                   "content": "Đồ ăn rất ngon",
 *                   "numOfStars": 4,
 *                   "createAt": "2021-04-26T03:29:00.439Z",
 *                   "reply": [
 *                       {
 *                           "_id": "60863bd9168d1d075cc6226c",
 *                           "userName": "Nguyen Van B",
 *                           "content": "Đồ ăn rất ngon. Đã mua lần 2",
 *                           "createAt": "2021-04-26T04:04:41.143Z"
 *                       }
 *                   ]
 *               }
 *           ]
 *     }
 * @apiErrorExample Response (example):
 *     HTTP/1.1 400
 *     {
 *       "status" : 400,
 *       "msg": "Role is invalid"
 *     }
 */
const getAllFeedbacks = async (req, res, next) => {
  try {
    const { foodId } = req.body;
    let feedbacks = await Feedback.aggregate([
      {
        $lookup: {
          from: "UserDetail",
          localField: "userId",
          foreignField: "userId",
          as: "userDetail",
        },
      },
      {
        $match: {
          foodId: Mongoose.Types.ObjectId(foodId),
        },
      },
    ]);
    console.log(feedbacks);
    feedbacks = feedbacks.map((x) => {
      return {
        _id: x._id,
        userName: x.userDetail[0].fullName,
        content: x.content,
        numOfStars: x.numOfStars,
        createAt: x.createAt,
        reply: x.reply,
      };
    });
    res.status(200).json({
      status: 200,
      msg: "Get all feedbacks successfully!",
      feedbacks,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
export const feedbackController = {
  addFeedback,
  reply,
  getAllFeedbacks,
};
