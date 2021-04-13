import bodyParser from "body-parser";
import helmet from "helmet";
import cors from "cors";
import express from "express";
import { upload } from "../configs";
import { envVariables } from "../configs";
const { nodeEnv } = envVariables;
const morgan = nodeEnv !== "production" && require("morgan");
export const defaultMiddleware = (app) => {
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());
  app.use(helmet());
  app.use(cors());
  app.use(express.json());
  app.use(upload.any());
  app.use(express.static("public"));
  app.use(morgan("dev"));
};
