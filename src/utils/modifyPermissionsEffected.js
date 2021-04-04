import createHttpError from "http-errors";
import { RolePermission, User, UserPermission } from "../models";

const initPermissions = async (roleId, userId) => {
  try {
    console.log(roleId);
    const permissions = await RolePermission.find({ roleId });
    console.log("permissions :" + JSON.stringify(permissions));
    const userPermissions = permissions.map((x) => {
      return {
        userId,
        permissionId: x,
      };
    });
    await UserPermission.insertMany(userPermissions);
  } catch (error) {
    console.log(error);
    throw createHttpError(400, "Bad request!");
  }
};
const addPermissionsForUserEffected = async (permissions, roleId) => {
  try {
    if (permissions.length == 0) {
      return;
    }
    const users = await User.find({ roleId });
    const userPermissions = users.map(
      (x) =>
        permissions.map((y) => {
          return {
            userId: x._id,
            permissionId: y,
          };
        })[0]
    );
    console.log("AddPermission: " + JSON.stringify(userPermissions));
    await UserPermission.insertMany(userPermissions);
  } catch (error) {
    console.log(error);
    throw createHttpError(400, "Bad request!");
  }
};
const delPermissionsForUserEffected = async (permissions, roleId) => {
  try {
    if (permissions.length == 0) {
      return;
    }
    const users = await User.find({ roleId });
    const userPermissions = users.map(
      (x) =>
        permissions.map((y) => {
          return {
            userId: x._id,
            permissionId: y,
          };
        })[0]
    );
    console.log("DelPermission: " + JSON.stringify(userPermissions));

    await Promise.all(userPermissions.map((x) => UserPermission.deleteOne(x)));
  } catch (error) {
    console.log(error);
    throw createHttpError(400, "Bad request!");
  }
};
export const modifyPermissionsEffected = {
  initPermissions,
  addPermissionsForUserEffected,
  delPermissionsForUserEffected,
};
