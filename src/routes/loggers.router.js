import express from "express";
import { loggers } from "../controllers/loggers.controller.js";
const loggerRouter = express.Router();

loggerRouter.get("/", loggers);

export default loggerRouter