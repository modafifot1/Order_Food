import createHttpError from "http-errors";
import {
  User,
  UserPermission,
  Role,
  RolePermission,
  UserDetail,
} from "../models";
const { adminRole, employeeRole, customerRole } = await Promise.all([
  Role.findOne({ roleName: "admin" }),
  Role.findOne({ roleName: "employee" }),
  Role.findOne({ roleName: "customer" }),
]);
//--------------------Managing employees---------------------------//

/**
 * @api {get} /api/v1/admin/employees Get list employees
 * @apiName Get list employees
 * @apiGroup Admin
 * @apiHeader {String} token The token can be generated from your user profile.
 * @apiHeaderExample {Header} Header-Example
 *      "Authorization: Bearer AAA.BBB.CCC"
 * @apiSuccess {Number} status <code> 200 </code>
 * @apiSuccess {String} msg <code>Regitser success</code> if everything went fine.
 * @apiSuccess {Array} listEmployees <code> An array list of employees </code>
 * @apiSuccessExample {json} Success-Example
 *     HTTP/1.1 200 OK
 *     {
 *         status: 200,
 *         msg: "Get list employee successfully!",
 *         listEmployees: [object1, object2, ...]
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
    const listEmployees = User.find({ roleId: employeeRole.id });
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
 * @apiParam {Int} role role's employee require "employee"
 * @apiParam {String} fullName name's employee
 * @apiParam {String} phoneNumber phone's employee
 * @apiParam {Date} birthday birthday's employee
 * @apiHeader {String} token The token can be generated from your user profile.
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
  const { email, password, roleId, fullName, phoneNumber, birthday } = req.body;
  try {
    const userExisted = await User.findOne({ email });
    if (userExisted) {
      throw createHttpError(400, "This email is used by others!");
    }
    // Check role
    // const checkRole = Role.findOne({ id: roleId });
    // if (!checkRole||checkRole.id != roleemployee.id) {
    //   throw createHttpError(401,"Role is invalid");
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
 * @apiHeader {String} token The token can be generated from your user profile.
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
 *              password: "sds54545602sdsd0bd8sds95d7a6b07b0b0eef9",
 *              roleId: 1,
 *              fullName: "Nguyen Quang Phieu",
 *              phoneNumber: "0364782445",
 *              birthday: 26/06/1999
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
    const employee = await User.findOne({ _id: employeeId });
    if (!employee) {
      throw createHttpError(400, "employeeId is not exist!");
    }
    const employeeDetail = await UserDetail.findOne({ userId: employeeId });
    res.status(200).json({
      status: 200,
      msg: "Get an employee successfully!",
      employee: {
        ...employee,
        fullName: employeeDetail.fullName,
        phoneNumber: employeeDetail.phoneNumber,
        birthday: employeeDetail.birthday,
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
 * @apiParam {String} email email's employee account
 * @apiParam {String} password password's employee account
 * @apiParam {Int} role role's employee require "employee"
 * @apiParam {String} fullName name's employee
 * @apiParam {String} phoneNumber phone's employee
 * @apiParam {Date} birthday birthday's employee
 * @apiHeader {String} token The token can be generated from your user profile.
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
    const {
      email,
      password,
      roleId,
      fullName,
      phoneNumber,
      birthday,
    } = req.body;
    const employee = await User.findByIdAndUpdate(employeeId, {
      email,
      password,
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
 * @apiHeader {String} token The token can be generated from your user profile.
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
    const employee = User.findByIdAndDelete(employeeId);
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
