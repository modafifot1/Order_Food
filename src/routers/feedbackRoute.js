import { Router } from "express";
export const feedbackRoute = Router();
const baseUrl = "/api/v1/feedbacks";
feedbackRoute.route(`${baseUrl}`).get();
feedbackRoute.route(`${baseUrl}`).post();
