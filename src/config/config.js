import dotenv from "dotenv";
import { Command, Option } from "commander";
import { loggerDev } from "./logger.js";

let programa = new Command();

programa.addOption(new Option("-m --mode <MODE>", "Modo de ejecución del Script").choices(["dev", "prod"]).default("prod"));

programa.parse();
const opts = programa.opts();

const mode = opts.mode;

loggerDev.info(`Ejecutando en modo ${mode}`);
dotenv.config({
  path: mode === "prod" ? "./src/.env.prod" : "./src/.env.dev",
  override: true,
});

export const config = {
  PORT: process.env.PORT || 8080,
  MENSAJE: process.env.MENSAJE,
  SECRET: process.env.SECRET,
  MONGO_URL: process.env.MONGO_URL,
  DB_NAME: process.env.DB_NAME || "basePruebas",
  CLIENTID: process.env.CLIENTID,
  CLIENTSECRET: process.env.CLIENTSECRET,
  CALLBACKURL: process.env.CALLBACKURL,
  mode: mode,
  GMAIL_USER: process.env.GMAIL_USER,
  GMAIL_PASS: process.env.GMAIL_PASS,
};
