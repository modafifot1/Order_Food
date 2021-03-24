import { Router } from "express";
const baseUrl = "/api/v1/admin";
export const adminRoute = Router();

//--------------------Managing employees---------------------------//
adminRoute.route(`${baseUrl}/employees`).get();
adminRoute.route(`${baseUrl}/employees/:employeeId`).get();
adminRoute.route(`${baseUrl}/empolyees`).post();
adminRoute.route(`${baseUrl}/employees/:employeeId`).put();
adminRoute.route(`${baseUrl}/employees/:employeeId`).delete();

//---------------------Assigning permissions of role--------------------------//
adminRoute.route(`${baseUrl}/roles`).get();
adminRoute.route(`${baseUrl}/permissions/:roleId`).get();
adminRoute.route(`${baseUrl}/permissions/:roleId/?applying`).post();
adminRoute.route(`${baseUrl}/permissions/:roleId/applying`).put();

//---------------------Assigning permissions of user--------------------------//
adminRoute.route(`${baseUrl}/users/:roleId`).get();
adminRoute.route(`${baseUrl}/users/:userId/permissions`).get();
adminRoute.route(`${baseUrl}/users/:userId/permissions`).put();

//---------------------Statisticing revenue-----------------------------------//
adminRoute.route(`${baseUrl}/revenues/days`).get();
adminRoute.rouote(`${baseUrl}/revenues/months`).get();
adminRoute.route(`${baseUrl}/revenues/quaters`).get();
adminRoute.route(`${baseUrl}/revenues/years`).get();
