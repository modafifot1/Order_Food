import { Role, User, UserDetail } from "../models";
import bcrypt from "bcryptjs";
import createHttpError from "http-errors";
import { encodeToken } from "../utils";

/**
 * @api {post} /api/v1/auth/register-customer register company
 * @apiName Register company
 * @apiGroup Auth
 * @apiParam {String} email email's customer account
 * @apiParam {String} password password's customer account
 * @apiParam {Int} role role's customer require "customer"
 * @apiParam {String} fullName name's customer
 * @apiParam {String} phoneNumber phone's customer
 * @apiParam {Date} birthday birthday's customer
 * @apiSuccess {String} msg <code>Regitser success</code> if everything went fine.
 * @apiSuccessExample {json} Success-Example
 *     HTTP/1.1 200 OK
 *     {
 *         status: 200,
 *         msg: "Regitser is success"
 *     }
 * @apiErrorExample Response (example):
 *     HTTP/1.1 400
 *     {
 *       "status" : 400,
 *       "msg": "\"role\" is required"
 *     }
 */
const registerCustomer = async (req, res, next) => {
  const { email, password, roleId, fullName, phoneNumber, birthday } = req.body;
  try {
    const userExisted = await User.findOne({ email });
    if (userExisted) {
      throw createHttpError(400, "This email is used by others!");
    }
    // Check role
    // const checkRole = Role.findOne({ id: roleId });
    // if (!checkRole||checkRole.roleName != "customer") {
    //   throw createHttpError(400,"Role is invalid");
    // }
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
const login = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const userExisted = await User.findOne({ email });
    if (!userExisted) {
      throw createHttpError(400, "Email doesn't exist!");
    }
    const match = await bcrypt.compare(password, userExisted.password);
    if (!match) {
      throw createHttpError(400, "Password is incorrect!");
    }
    const userData = {
      _id: userExisted._id,
      email: userExisted.email,
      roleId: userExisted.roleId,
    };

    const token = encodeToken(userData);

    res.status(200).json({
      status: 200,
      msg: "success!",
      roleId: userExisted.roleId,
      token,
    });
  } catch (error) {}
};
export const authController = {
  registerCustomer,
  login,
};
