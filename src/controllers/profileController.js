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
const updateProfile = async (req, res, next) => {
  try {
    const { fullName, phoneNumber, birthday } = req.body;
    const userId = req.params.userId;
    const user = await User.findOne({ _id: userId });
    if (!user) {
      throw createHttpError(404, "User is not exist!");
    }
    await UserDetail.findOneAndUpdate(
      { userId },
      {
        phoneNumber,
        fullName,
        birthday,
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
