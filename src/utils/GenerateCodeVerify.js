import { Code } from "../models";

const ramdomCode = require("randomatic");
export const getCodeVerify = async (userId, next) => {
  try {
    do {
      const code = ramdomCode("0aA", 8);
      const exist = Code.findOne({ code });
      console.log(code);
      console.log(xe);
      if (!exist) {
        Code.create({
          code,
          customserId: userId,
        });
        return code;
      }
    } while (true);
  } catch (error) {
    console.log(error);
    next(error);
  }
};
