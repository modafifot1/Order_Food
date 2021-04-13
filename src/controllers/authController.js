import { Role, User, UserDetail } from "../models";
import bcrypt from "bcryptjs";
import createHttpError from "http-errors";
import { encodeToken, destroyToken, modifyPermissionsEffected } from "../utils";
const { initPermissions } = modifyPermissionsEffected;
/**
 * @api {post} /api/v1/auth/register-customer register for customer
 * @apiName Register for customer
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
  const {
    email,
    password,
    roleId,
    fullName,
    phoneNumber,
    birthday,
    address,
  } = req.body;
  try {
    const userExisted = await User.findOne({ email });
    if (userExisted) {
      throw createHttpError(400, "This email is used by others!");
    }
    // Check role
    const checkRole = await Role.findOne({ id: roleId });
    if (!checkRole || checkRole.roleName != "customer") {
      throw createHttpError(400, "Role is invalid");
    }
    const hashPassword = await bcrypt.hash(password, 12);
    const newUser = await User.create({
      email,
      password: hashPassword,
      roleId: roleId,
    });

    await UserDetail.create({
      userId: newUser._id,
      fullName,
      phoneNumber,
      birthday: new Date(birthday),
      address,
    });
    await initPermissions(roleId, newUser._id);
    res.status(200).json({
      status: 200,
      msg: "Register is success!",
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
/**
 * @api {post} /api/v1/auth/login login for all users
 * @apiName Login for all users
 * @apiGroup Auth
 * @apiParam {String} email email's user account
 * @apiParam {String} password password's user account
 * @apiSuccess {Int} status <code> 200</code>
 * @apiSuccess {String} msg <code>Login success</code> if everything went fine.
 * @apiSuccess {String} token <code>Token of user </code>
 * @apiSuccess {Array[Int]} roleId <code> An array role of user </code>
 * @apiSuccess {ObjectId} userId
 * @apiSuccess {String} imageUrl
 * @apiSuccess {String} fullName
 * @apiSuccessExample {json} Success-Example
 *     HTTP/1.1 200 OK
 *     {
 *         status: 200,
 *         msg: "Login is success",
 *         roleId: [1],
 *         token: "xxx.xxx.xxx",
 *         userId:"605a06776c02022ab46cc160",
 *         imageUrl:"211d2s12c3fsf3s2df",
 *         fullName: "Nguyen Quang Phieu"
 *     }
 * @apiErrorExample Response (example):
 *     HTTP/1.1 400
 *     {
 *       "status" : 400,
 *       "msg":  userName or password is incorrect!"
 *     }
 */
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

    const token = await encodeToken(userData);
    const userDetail = await UserDetail.findOne({ userId: userExisted._id }, [
      "imageUrl",
      "fullName",
    ]);
    res.status(200).json({
      status: 200,
      msg: "success!",
      roleId: userExisted.roleId,
      token,
      userId: userExisted._id,
      imageUrl: userDetail.imageUrl,
      fullName: userDetail.fullName,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
/**
 * @api {post} /api/v1/auth/logout Logout for all user
 * @apiName Logout for all user
 * @apiGroup Auth
 * @apiHeader {String} token The token can be generated from your user profile.
 * @apiHeaderExample {Header} Header-Example
 *      "Authorization: Bearer AAA.BBB.CCC"
 * @apiSuccess {Number} status <code> 200 </code>
 * @apiSuccess {String} msg <code>Logoutsuccessfully</code>
 * @apiSuccessExample {json} Success-Example
 *     HTTP/1.1 200 OK
 *     {
 *         status: 200,
 *         msg: "Logout successfully!",
 *     }
 * @apiErrorExample Response (example):
 *     HTTP/1.1 400
 *     {
 *       "status" : 400,
 *       "msg": "Not found"
 *     }
 */
const logout = async (req, res, next) => {
  try {
    if (
      !req.headers.authorization ||
      !req.headers.authorization.startsWith("Bearer")
    ) {
      throw createHttpError(401, "No token, authorization denied!");
    }
    const userId = req.params.userId;
    await destroyToken(userId);
    res.status(200).json({
      status: 200,
      msg: "Logout success!",
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
export const authController = {
  registerCustomer,
  login,
  logout,
};
