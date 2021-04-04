import { Router } from "express";
import { profileController } from "../controllers";
import { jwtMiddleware } from "../middlewares";
import { validateRequestBody } from "../middlewares";
const { validateProfileData } = validateRequestBody;
const baseUrl = "/api/v1/profile";
const { getProfile, updateProfile } = profileController;

export const profileRote = Router();

profileRote.use(`${baseUrl}`, jwtMiddleware);
profileRote.route(`${baseUrl}/:userId`).get(getProfile);
profileRote.route(`${baseUrl}/:userId`).put(validateProfileData, updateProfile);
profileRote.route(`${baseUrl}/avatar/:userId`).put();
