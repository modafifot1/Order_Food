import createHttpError from "http-errors";
import Schema from "mongoose";
import { User, UserDetail } from "../models";
const getProfile = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    console.log("userId: " + userId);
    const user = await User.aggregate([
      {
        $lookup: {
          from: "UserDetail",
          localField: "_id",
          foreignField: "userId",
          as: "userDetail",
        },
      },
      {
        $match: {
          _id: Schema.Types.ObjectId(userId),
        },
      },
      {
        $project: {
          __v: 0,
          createAt: 0,
          updateAt: 0,
          password: 0,
          "userDetail._id": 0,
          "userDetail.__v": 0,
        },
      },
    ]);

    if (!user[0]) {
      throw createHttpError(404, "user is not exists");
    }
    console.log("user: " + JSON.stringify(user));
    res.status(200).json({
      status: 200,
      msg: "Get user profile successfully!",
      user: {
        email: user[0].email,
        ...user[0].userDetail[0],
      },
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
/**
 * @api {put} /api/v1/profile/:userId update profile by userId
 * @apiName update profile by userId
 * @apiGroup Profile
 * @apiParam {String} fullName name's customer
 * @apiParam {String} phoneNumber phone's customer
 * @apiParam {Date} birthday birthday's customer
 * @apiParam {String} address address's customer
 * @apiHeader {String} token The token can be generated from your user profile.
 * @apiHeaderExample {Header} Header-Example
 *      "Authorization: Bearer AAA.BBB.CCC"
 * @apiSuccess {Number} status <code> 200 </code>
 * @apiSuccess {String} msg <code>Update profile success</code> if everything went fine.
 * @apiSuccessExample {json} Success-Example
 *     HTTP/1.1 201 OK
 *     {
 *         status: 200,
 *         msg: "update profile successfully!",
 *     }
 * @apiErrorExample Response (example):
 *     HTTP/1.1 400
 *     {
 *       "status" : 400,
 *       "msg": "Role is invalid"
 *     }
 */
const updateProfile = async (req, res, next) => {
  try {
    const { fullName, phoneNumber, birthday, address } = req.body;
    const userId = req.user._id;
    console.log("userId :", userId);
    const user = await User.findOne({ _id: userId });
    console.log("User: ", user);
    if (!user) {
      throw createHttpError(404, "User is not exist!");
    }
    await UserDetail.findOneAndUpdate(
      { userId },
      {
        phoneNumber,
        fullName,
        birthday,
        address,
      }
    );
    res.status(200).json({
      status: 200,
      msg: "Update profile successfully!",
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const profileController = {
  getProfile,
  updateProfile,
};
