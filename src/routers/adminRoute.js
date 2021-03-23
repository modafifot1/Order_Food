import { Router } from "express";
const baseUrl = "/api/v1/admin";
export const adminRoute = Router();
adminRoute.route(`${baseUrl}/newEmpolyee`).post();
