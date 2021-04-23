import createHttpError from "http-errors";
import bcrypt from "bcryptjs";
import {
  User,
  Permission,
  Role,
  RolePermission,
  UserDetail,
  UserPermission,
  Food,
} from "../models";
import Mongoose from "mongoose";
import { modifyPermissionsEffected } from "../utils";
const {
  initPermissions,
  addPermissionsForUserEffected,
  delPermissionsForUserEffected,
} = modifyPermissionsEffected;
//--------------------Managing employees---------------------------//

/**
 * @api {get} /api/v1/admin/employees Get list employees
 * @apiName Get list employees
 * @apiGroup Admin
 * @apiHeader {String} Authorization The token can be generated from your user profile.
 * @apiHeaderExample {Header} Header-Example
 *      "Authorization: Bearer AAA.BBB.CCC"
 * @apiSuccess {Number} status <code> 200 </code>
 * @apiSuccess {String} msg <code>Regitser success</code> if everything went fine.
 * @apiSuccess {Array} listEmployees <code> List of eployees</code>
 * @apiSuccessExample {json} Success-Example
 *     HTTP/1.1 200 OK
 *     {
 *         status: 200,
 *         msg: "Get list employee successfully!",
 *         listEmployees: [
 *          {
 *          "_id": "6076c201228fe14534c3ca4a",
 *           "email": "employees1@gmail.com",
 *           "roleId": 2,
 *           "fullName": "Nguyen Van B",
 *           "phoneNumber": "03566382356",
 *           "birthday": "1999-04-27T17:00:00.000Z"
 *          }
 *        ]
 *     }
 * @apiErrorExample Response (example):
 *     HTTP/1.1 400
 *     {
 *       "status" : 400,
 *       "msg": "Not found"
 *     }
 */
const getListEmployees = async (req, res, next) => {
  try {
    const employeeRole = await Role.findOne({ roleName: "employee" });
    let listEmployees = await User.aggregate([
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
          roleId: employeeRole.id,
        },
      },
    ]);
    listEmployees = listEmployees.map((x) => {
      return {
        _id: x._id,
        email: x.email,
        roleId: x.roleId,
        fullName: x.userDetail[0].fullName,
        phoneNumber: x.userDetail[0].phoneNumber,
        birthday: x.userDetail[0].birthday,
        address: x.userDetail[0].address,
      };
    });
    res.status(200).json({
      status: 200,
      msg: "Get list employee successfully!",
      listEmployees,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
/**
 * @api {post} /api/v1/admin/employees Create a new employee
 * @apiName Create a new eployees
 * @apiGroup Admin
 * @apiParam {String} email email's employee account
 * @apiParam {String} password password's employee account
 * @apiParam {Int} roleId role's employee required value = 2
 * @apiParam {String} fullName name's employee
 * @apiParam {String} phoneNumber phone's employee
 * @apiParam {Date} birthday birthday's employee
 * @apiHeader {String} Authorization The token can be generated from your user profile.
 * @apiHeaderExample {Header} Header-Example
 *      "Authorization: Bearer AAA.BBB.CCC"
 * @apiSuccess {Number} status <code> 201 </code>
 * @apiSuccess {String} msg <code>Regitser success</code> if everything went fine.
 * @apiSuccessExample {json} Success-Example
 *     HTTP/1.1 201 OK
 *     {
 *         status: 201,
 *         msg: "Create an employee successfully!"
 *     }
 * @apiErrorExample Response (example):
 *     HTTP/1.1 400
 *     {
 *       "status" : 400,
 *       "msg": "Role is invalid"
 *     }
 */
const createNewEmployee = async (req, res, next) => {
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
    const checkRole = await Role.findOne({ id: roleId });
    if (!checkRole || checkRole.roleName != "employee") {
      throw createHttpError(401, "Role is invalid");
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
    res.status(201).json({
      status: 201,
      msg: "Create a new employee successfully!",
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
/**
 * @api {get} /api/v1/admin/employees/:employeeId Get an employee by id
 * @apiName Get an employee
 * @apiGroup Admin
 * @apiHeader {String} Authorization The token can be generated from your user profile.
 * @apiHeaderExample {Header} Header-Example
 *      "Authorization: Bearer AAA.BBB.CCC"
 * @apiSuccess {Number} status <code> 200 </code>
 * @apiSuccess {String} msg <code>Regitser success</code> if everything went fine.
 * @apiSuccess {Object} employee <code> An employee </code>
 * @apiSuccessExample {json} Success-Example
 *     HTTP/1.1 200 OK
 *     {
 *         status: 200,
 *         msg: "Get an employee successfully!",
 *         employee: {
 *              _id: "6020bd895d7a6b07b0b0eef9",
 *              email: "nqp260699@gmail.com",
 *              roleId: 1,
 *              "fullName": "Nguyen van A",
 *              "phoneNumber": "0325656596",
 *              "birthday": "1999-02-04T17:00:00.000Z",
 *         }
 *     }
 * @apiErrorExample Response (example):
 *     HTTP/1.1 400
 *     {
 *       "status" : 400,
 *       "msg": "Not found"
 *     }
 */
const getEmpployeeById = async (req, res, next) => {
  try {
    const employeeId = req.params.employeeId;
    const employee = await User.aggregate([
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
          _id: Mongoose.Types.ObjectId(employeeId),
        },
      },
    ]);
    if (!employee) {
      throw createHttpError(400, "employeeId is not exist!");
    }
    res.status(200).json({
      status: 200,
      msg: "Get an employee successfully!",
      employee: {
        _id: employee[0]._id,
        email: employee[0].email,
        role: employee[0].role,
        createAt: employee[0].createAt,
        phoneNumber: employee[0].userDetail[0].phoneNumber,
        fullName: employee[0].userDetail[0].fullName,
        birthday: employee[0].userDetail[0].birthday,
      },
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
/**
 * @api {put} /api/v1/admin/employees/:employeeId Update a employee
 * @apiName Update a eployees
 * @apiGroup Admin
 * @apiParam {String} employeeId id's employee
 * @apiParam {String} email email's employee
 * @apiParam {String} password password's employee
 * @apiParam {Int} role role's employee require value = 2
 * @apiParam {String} fullName name's employee
 * @apiParam {String} phoneNumber phone's employee
 * @apiParam {Date} birthday birthday's employee
 * @apiHeader {String} Authorization The token can be generated from your user profile.
 * @apiHeaderExample {Header} Header-Example
 *      "Authorization: Bearer AAA.BBB.CCC"
 * @apiSuccess {Number} status <code> 201 </code>
 * @apiSuccess {String} msg <code>Update successfully</code> if everything went fine.
 * @apiSuccessExample {json} Success-Example
 *     HTTP/1.1 201 OK
 *     {
 *         status: 201,
 *         msg: "Update an employee successfully!"
 *     }
 * @apiErrorExample Response (example):
 *     HTTP/1.1 400
 *     {
 *       "status" : 400,
 *       "msg": "Role is invalid"
 *     }
 */
const updateEmployeeById = async (req, res, next) => {
  try {
    const employeeId = req.params.employeeId;
    const { email, roleId, fullName, phoneNumber, birthday } = req.body;
    const employee = await User.findByIdAndUpdate(employeeId, {
      email,
      roleId,
    });
    if (!employee) {
      throw createHttpError(400, "An employee is not exist!");
    }
    await UserDetail.findOneAndUpdate(
      { userId: employeeId },
      {
        fullName,
        phoneNumber,
        birthday: new Date(birthday),
      }
    );
    res.status(200).json({
      status: 200,
      msg: "Update an employee successfully!",
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
/**
 * @api {delete} /api/v1/admin/employees/:employeeId Delete an employee by id
 * @apiName Delete an employee
 * @apiGroup Admin
 * @apiParam {String} employeeId id's employee
 * @apiHeader {String} Authorization The token can be generated from your user profile.
 * @apiHeaderExample {Header} Header-Example
 *      "Authorization: Bearer AAA.BBB.CCC"
 * @apiSuccess {Number} status <code> 200 </code>
 * @apiSuccess {String} msg <code>Delete successfully</code>
 * @apiSuccessExample {json} Success-Example
 *     HTTP/1.1 200 OK
 *     {
 *         status: 200,
 *         msg: "Get an employee successfully!",
 *     }
 * @apiErrorExample Response (example):
 *     HTTP/1.1 400
 *     {
 *       "status" : 400,
 *       "msg": "Not found"
 *     }
 */
const deleteEmployeeById = async (req, res, next) => {
  try {
    const employeeId = req.params.employeeId;
    const employee = await Promise.all([
      User.findByIdAndDelete(employeeId),
      UserDetail.findOneAndDelete({ userId: employeeId }),
    ]);
    console.log(JSON.stringify(employee));
    if (!employee) {
      throw createHttpError(400, "An employee is not exist!");
    }
    res.status(200).json({
      status: 200,
      msg: "Delete an employee successfully!",
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
/**
 * @api {get} /api/v1/admin/roles Get all role of system
 * @apiName Get all role
 * @apiGroup Admin
 * @apiHeader {String} Authorization The token can be generated from your user profile.
 * @apiHeaderExample {Header} Header-Example
 *      "Authorization: Bearer AAA.BBB.CCC"
 * @apiSuccess {Number} status <code> 200 </code>
 * @apiSuccess {String} msg <code>get all role successfully</code>
 * @apiSuccess {Array} listRoles <code> An array role </code>
 * @apiSuccessExample {json} Success-Example
 *     HTTP/1.1 200 OK
 *     {
 *         status: 200,
 *         msg: "Get an employee successfully!",
 *         listRoles: [
 *          {
 *            "_id": "605be446ddf39f2daf48b701",
 *            "id": 1,
 *            "roleName": "customer"
 *           },
 *           {
 *            "_id": "605be482ddf39f2daf48b702",
 *            "id": 0,
 *            "roleName": "admin"
 *            }
 *          ]
 *     }
 * @apiErrorExample Response (example):
 *     HTTP/1.1 400
 *     {
 *       "status" : 400,
 *       "msg": "Not found"
 *     }
 */
const getAllRoles = async (req, res, next) => {
  try {
    const listRoles = await Role.find({});
    res.status(200).json({
      status: 200,
      msg: "Get list role successfully!",
      listRoles,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
/**
 * @api {get} /api/v1/admin/permissions/:roleId Get permission by roleId
 * @apiName Get permissions
 * @apiGroup Admin
 * @apiParam {number} roleId id's role
 * @apiHeader {String} Authorization The token can be generated from your user profile.
 * @apiHeaderExample {Header} Header-Example
 *      "Authorization: Bearer AAA.BBB.CCC"
 * @apiSuccess {Number} status <code> 200 </code>
 * @apiSuccess {String} msg <code>get permissions successfully</code>
 * @apiSuccess {Array} listPermissions <code> An array permissions </code>
 * @apiSuccessExample {json} Success-Example
 *     HTTP/1.1 200 OK
 *     {
 *         status: 200,
 *         msg: "Get permissions by roleId successfully!",
 *         listPermissions: [
 *          {
 *           "_id": "606318bbae23812268265ef0",
 *           "name": "EMPLOYEE",
 *           "action": "Edit",
 *           "__v": 0,
 *           "license": 0 // 0 -is not allowed
 *          },
 *          {
 *           "_id": "606318bbae23812268265f03",
 *           "name": "USER_PROFILE",
 *           "action": "Edit",
 *           "__v": 0,
 *           "license": 1 // 1-is allowed
 *          },
 *         ]
 *     }
 * @apiErrorExample Response (example):
 *     HTTP/1.1 400
 *     {
 *       "status" : 400,
 *       "msg": "Not found"
 *     }
 */
const getPermissionsByRoleId = async (req, res, next) => {
  try {
    const roleId = req.params.roleId;
    const allPermissions = await Permission.find({});
    const rolePermissions = await RolePermission.find({ roleId });
    const listPermissionId = rolePermissions.map((x) => String(x.permissionId));
    const listPermissions = allPermissions.map((x) => {
      let license = 0;
      if (listPermissionId.includes(String(x._id))) {
        license = 1;
      }
      return {
        ...x._doc,
        license,
      };
    });
    res.status(200).json({
      status: 200,
      msg: "Get list permissions of role successfully!",
      listPermissions,
    });
    console.log("all: " + typeof allPermissions[0]._id);
    console.log(
      "license: " +
        typeof listPermissionId[0] +
        JSON.stringify(listPermissionId)
    );
  } catch (error) {
    console.log(error);
    next(error);
  }
};
/**
 * @api {put} /api/v1/admin/permissions/:roleId Update permission by roleId
 * @apiName Update permissions
 * @apiGroup Admin
 * @apiParam {number} roleId id's role
 * @apiParam {Array} permissions an array of permissionId which is checked
 * @apiHeader {String} Authorization The token can be generated from your user profile.
 * @apiHeaderExample {Header} Header-Example
 *      "Authorization: Bearer AAA.BBB.CCC"
 * @apiSuccess {Number} status <code> 200 </code>
 * @apiSuccess {String} msg <code>update permissions successfully</code>
 * @apiSuccessExample {json} Success-Example
 *     HTTP/1.1 200 OK
 *     {
 *         status: 200,
 *         msg: "Update permissions by roleId successfully!",
 *     }
 * @apiErrorExample Response (example):
 *     HTTP/1.1 400
 *     {
 *       "status" : 400,
 *       "msg": "Not found"
 *     }
 */
const updatePermissionsByRoleId = async (req, res, next) => {
  try {
    const roleId = req.params.roleId;
    let permissions = await RolePermission.find({ roleId });
    permissions = permissions.map((x) => String(x.permissionId));
    const updatePermissions = req.body.permissions;
    const addPermissions = updatePermissions.filter(
      (x) => !permissions.includes(x)
    );
    const delPermissions = permissions.filter(
      (x) => !updatePermissions.includes(x)
    );
    await RolePermission.insertMany(
      addPermissions.map((x) => {
        return {
          roleId,
          permissionId: x,
        };
      })
    );
    await RolePermission.deleteMany({
      permissionId: delPermissions,
    });
    const applying = req.query.applying;
    if (applying == 1) {
      addPermissionsForUserEffected(addPermissions, roleId);
    }
    delPermissionsForUserEffected(delPermissions, roleId);
    res.status(200).json({
      status: 200,
      msg: "Update permissions of role successfully!",
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
/**
 * @api {get} /api/v1/admin/users Get all users
 * @apiName Get all user
 * @apiGroup Admin
 * @apiHeader {String} Authorization The token can be generated from your user profile.
 * @apiHeaderExample {Header} Header-Example
 *      "Authorization: Bearer AAA.BBB.CCC"
 * @apiSuccess {Number} status <code> 200 </code>
 * @apiSuccess {String} msg <code>update permissions successfully</code>
 * @apiSuccess {Array} listUsers <code> An array of users </code>
 * @apiSuccessExample {json} Success-Example
 *     HTTP/1.1 200 OK
 *     {
 *         status: 200,
 *         msg: "Update permissions by roleId successfully!",
 *         listUsers: [
 *             {
 *                 "_id": "6062e0988b0140276c76269e",
 *                 "roleId": [
 *                     2
 *                 ],
 *                 "email": "employee2@gmail.com",
 *                 "password": "$2a$12$zitmHHPzp/LYBwGnfgRqVOGn7Amp/8zphXLAN0/TCSgtexCl6TlLG",
 *                 "userDetail": [
 *                     {
 *                         "_id": "6062e0988b0140276c76269f",
 *                         "userId": "6062e0988b0140276c76269e",
 *                         "fullName": "Nguyen van B",
 *                         "phoneNumber": "0325656596",
 *                         "birthday": "1999-02-04T17:00:00.000Z",
 *                         "__v": 0
 *                     }
 *                 ]
 *             },
 *         ]
 *     }
 * @apiErrorExample Response (example):
 *     HTTP/1.1 400
 *     {
 *       "status" : 400,
 *       "msg": "Not found"
 *     }
 **/
const getAllUsers = async (req, res, next) => {
  try {
    const listUsers = await User.aggregate([
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
          roleId: {
            $ne: [0],
          },
        },
      },
      {
        $project: { __v: 0, createAt: 0, updateAt: 0 },
      },
    ]);
    res.status(200).json({
      status: 200,
      msg: "Get List users successfully",
      listUsers,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
/**
 * @api {get} /api/v1/admin/users/:userId/permissions Get permissions by userId
 * @apiName Get permission by userId
 * @apiGroup Admin
 * @apiParam {string} userId id of user
 * @apiHeader {String} Authorization The token can be generated from your user profile.
 * @apiHeaderExample {Header} Header-Example
 *      "Authorization: Bearer AAA.BBB.CCC"
 * @apiSuccess {Number} status <code> 200 </code>
 * @apiSuccess {String} msg <code>Get permissions successfully</code>
 * @apiSuccess {Array} listPermissions <code> An array permissions of user </code>
 * @apiSuccessExample {json} Success-Example
 *     HTTP/1.1 200 OK
 *     {
 *         status: 200,
 *         msg: "Get permissions by userId successfully!",
 *         listPermissions: [
 *          {
 *               "roleId": 2,
 *               "permissionId": "606318bbae23812268265f03",
 *               "name": "USER_PROFILE",
 *               "action": "Edit",
 *               "license": 0
 *           },
 *           {
 *               "roleId": 2,
 *               "permissionId": "606318bbae23812268265f04",
 *               "name": "USER_PROFILE",
 *               "action": "View",
 *               "license": 0
 *           },
 *         ]
 *     }
 * @apiErrorExample Response (example):
 *     HTTP/1.1 400
 *     {
 *       "status" : 400,
 *       "msg": "Not found"
 *     }
 **/
const getPermissionsByUserId = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    let user = await User.findOne({ _id: userId });
    if (!user) {
      throw createHttpError(404, "User is not existed!");
    }
    const roleId = user.roleId;
    let permissionsByRoleId = await RolePermission.aggregate([
      {
        $lookup: {
          from: "Permission",
          localField: "permissionId",
          foreignField: "_id",
          as: "permissionDetail",
        },
      },
      {
        $match: {
          roleId: roleId,
        },
      },
    ]);
    let permissionsByUserId = await UserPermission.find({ userId });
    permissionsByUserId = permissionsByUserId.map((x) =>
      String(x.permissionId)
    );
    console.log(permissionsByUserId);
    permissionsByRoleId = permissionsByRoleId.map((x) => {
      let license = 0;
      if (permissionsByUserId.includes(String(x.permissionId))) {
        license = 1;
      }
      return {
        roleId: x.roleId,
        permissionId: x.permissionId,
        name: x.permissionDetail[0].name,
        action: x.permissionDetail[0].action,
        license,
      };
    });
    res.status(200).json({
      status: 200,
      msg: "Get list permissions by userId successfully!",
      listPermissons: permissionsByRoleId,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
/**
 * @api {put} /api/v1/admin/users/:userId/permissions Update permissions by userId
 * @apiName Update permission by userId
 * @apiGroup Admin
 * @apiParam {string} userId id of user
 * @apiParam {array} permissions this is permissions is checked
 * @apiHeader {String} Authorization The token can be generated from your user profile.
 * @apiHeaderExample {Header} Header-Example
 *      "Authorization: Bearer AAA.BBB.CCC"
 * @apiSuccess {Number} status <code> 200 </code>
 * @apiSuccess {String} msg <code>Update permissions successfully</code>
 * @apiSuccessExample {json} Success-Example
 *     HTTP/1.1 200 OK
 *     {
 *         status: 200,
 *         msg: "Update permissions by userId successfully!",
 *     }
 * @apiErrorExample Response (example):
 *     HTTP/1.1 400
 *     {
 *       "status" : 400,
 *       "msg": "Not found"
 *     }
 **/
const updatePermissionsByUserId = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    let user = await User.findOne({ _id: userId });
    if (!user) {
      throw createHttpError(404, "User is not existed!");
    }
    const roleId = user.roleId;
    let listPermissions = await UserPermission.find({ userId }, [
      "permissionId",
    ]);
    listPermissions = listPermissions.map((x) => String(x.permissionId));
    let listUpdatePermissions = req.body.permissions;
    let listDelPermissions = listPermissions.filter(
      (x) => !listUpdatePermissions.includes(x)
    );
    let listAddPermissions = listUpdatePermissions.filter(
      (x) => !listPermissions.includes(x)
    );
    listDelPermissions = await validatePermissionInRole(
      roleId,
      listDelPermissions
    );
    listAddPermissions = await validatePermissionInRole(
      roleId,
      listAddPermissions
    );
    await UserPermission.insertMany(
      listAddPermissions.map((x) => {
        return {
          userId,
          permissionId: x,
        };
      })
    );
    await UserPermission.deleteMany({
      permissionId: listDelPermissions,
    });
    res.status(200).json({
      status: 200,
      msg: "Update permissions for user successfully!",
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
const validatePermissionInRole = async (roleId, listPermissions) => {
  try {
    let permissionsByRoleId = await RolePermission.find({ roleId });
    permissionsByRoleId = permissionsByRoleId.map((x) =>
      String(x.permissionId)
    );
    console.log("permissionInrole: " + permissionsByRoleId);
    return listPermissions.filter((x) => permissionsByRoleId.includes(x));
  } catch (error) {
    console.log(error);
  }
};
/**
 * @api {get} /api/v1/admin/foods Get list of food to confirm
 * @apiName Get list of food to confirm
 * @apiGroup Admin
 * @apiHeader {String} Authorization The token can be generated from your user profile.
 * @apiHeaderExample {Header} Header-Example
 *      "Authorization: Bearer AAA.BBB.CCC"
 * @apiSuccess {Number} status <code> 200 </code>
 * @apiSuccess {String} msg <code>Get list food successfully</code>
 * @apiSuccess {Array} foods <code> Array foods which need confirming </code>
 * @apiSuccessExample {json} Success-Example
 *     HTTP/1.1 200 OK
 *     {
 *         status: 200,
 *         msg: "Get list food successfully!",
 *         "foods": [
 *             {
 *                 "confirmed": false,
 *                 "_id": "607d81b6e141e742289e2ecf",
 *                 "typeId": 1,
 *                 "name": "Gà sốt me",
 *                 "unitPrice": 50000,
 *                 "imageUrl": "https://res.cloudinary.com/dacnpm17n2/image/upload/v1618837943/qrqsf3qukvlsnzslfry2.jpg",
 *                 "createAt": "2021-04-19T13:12:22.475Z",
 *                 "__v": 0
 *             }
 *         ]
 *     }
 * @apiErrorExample Response (example):
 *     HTTP/1.1 400
 *     {
 *       "status" : 400,
 *       "msg": "Not found"
 *     }
 **/
const getListFoodConfirm = async (req, res, next) => {
  try {
    const foods = await Food.find({ confirmed: false });
    res.status(200).json({
      status: 200,
      msg: "Get list confirm food successfullY!",
      foods,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
/**
 * @api {post} /api/v1/admin/foods/:foodId Confirm food when create new one
 * @apiName Confirm food when create new one
 * @apiGroup Admin
 * @apiHeader {String} Authorization The token can be generated from your user profile.
 * @apiHeaderExample {Header} Header-Example
 *      "Authorization: Bearer AAA.BBB.CCC"
 * @apiSuccess {Number} status <code> 200 </code>
 * @apiSuccess {String} msg <code> Confirm successully</code>
 * @apiSuccessExample {json} Success-Example
 *     HTTP/1.1 200 OK
 *     {
 *         status: 200,
 *         msg: "Confirm successully!",
 *     }
 * @apiErrorExample Response (example):
 *     HTTP/1.1 400
 *     {
 *       "status" : 400,
 *       "msg": "Not found"
 *     }
 **/
const confirmFood = async (req, res, next) => {
  try {
    const foodId = req.params.foodId;
    const food = await Food.findByIdAndUpdate(foodId, {
      confirmed: true,
    });
    if (!food) throw createHttpError(400, "Not found food by foodId!");
    res.status(200).json({
      status: 200,
      msg: "Confirm food successfully!",
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
export const adminController = {
  createNewEmployee,
  getListEmployees,
  getEmpployeeById,
  updateEmployeeById,
  deleteEmployeeById,
  getAllRoles,
  getPermissionsByRoleId,
  updatePermissionsByRoleId,
  getAllUsers,
  getPermissionsByUserId,
  updatePermissionsByUserId,
  getListFoodConfirm,
  confirmFood,
};
