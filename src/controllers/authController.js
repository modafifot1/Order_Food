import { User, UserDetail } from "../models";
import bcrypt from "bcryptjs";
import createHttpError from "http-errors";
export const registerCustomer = async (req, res, next) => {
  const { email, password, roleId, fullName, phoneNumber, birthday } = req.body;
  try {
    const userExisted = await User.findOne({ email });
    if (userExisted) {
      throw createHttpError(400, "This email is used by others!");
    }
    const hashPassword = await bcrypt.hash(password, 12);
    const newUser = await User.create({
      email,
      password: hashPassword,
      roleId: [roleId],
    });

    await UserDetail.create({
      userId: newUser._id,
      fullName,
      phoneNumber,
      birthday: new Date(birthday),
    });
    res.status(200).json({
      status: 200,
      msg: "Register is success!",
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
