import winston from "winston";
import { config } from "./config.js";
import __dirname from "../utils.js";
import path from "path";

const loggerOptions = {
  levels: {
    debug: 0,
    http: 1,
    info: 2,
    warn: 3,
    error: 4,
    fatal: 5,
  },
  colors: {
    debug: "cyan",
    http: "green",
    info: "blue",
    warn: "yellow",
    error: "red",
    fatal: "magenta",
  },
};

winston.addColors(loggerOptions.colors);

export const loggerProd = winston.createLogger({
  levels: loggerOptions.levels,
  transports: [
    new winston.transports.Console({
      level: "info",
      format: winston.format.combine(winston.format.colorize({ colors: loggerOptions.colors }), winston.format.simple()),
    }),
    new winston.transports.File({
      filename: path.join(__dirname, "logs", "error.log"),
      level: "fatal",
      format: winston.format.combine(winston.format.timestamp(), winston.format.prettyPrint()),
    }),
  ],
});

export const loggerDev = winston.createLogger({
  levels: loggerOptions.levels,
  transports: [
    new winston.transports.Console({
      level: "fatal",
      format: winston.format.combine(winston.format.colorize({ colors: loggerOptions.colors }), winston.format.simple()),
    }),
  ],
});

export const addLogger = (req, res, next) => {
  if (config.mode === "prod") {
    req.logger = loggerProd;
  } else {
    req.logger = loggerDev;
  }
  next();
};
