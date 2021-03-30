import createHttpError from "http-errors";
import { verifyToken } from "../utils";
export const jwtMiddleware = async (req, res, next) => {
  try {
    if (
      !req.headers.authorization ||
      !req.headers.authorization.startsWith("Bearer")
    ) {
      throw createHttpError(401, "No token, authorization denied!");
    }
    try {
      const token = req.headers.authorization.split(" ")[1];
      const userData = verifyToken(token);
      req.user = userData;
      next();
    } catch (error) {
      console.log(error);
      throw createHttpError(400, "Token is invalid");
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
};
