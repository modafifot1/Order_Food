import createHttpError from "http-errors";
import { Code } from "../models";

const ramdomCode = require("randomatic");
export const getCodeVerify = async (userId, next) => {
  try {
    do {
      const code = ramdomCode("0aA", 8);
      const exist = await Code.findOne({ code });
      console.log(code);
      console.log(exist);
      if (!exist) {
        Code.create({
          code,
          userId,
        });
        return code;
      }
    } while (true);
  } catch (error) {
    console.log(error);
    next(error);
  }
};
export const confirmCode = async (code, order, next) => {
  try {
    const confirmCode = await Code.findOne({ code });
    if (!confirmCode || order.code != code) return false;
    const duration = Date.now() - new Date(code.createAt).getTime();
    if (duration > 3 * 60 * 60 * 1000)
      throw createHttpError(400, "Code expires");
    await Code.findOneAndDelete({ code });
    return true;
  } catch (error) {
    console.log(error);
    next(error);
  }
};
