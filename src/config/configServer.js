import mongoose from "mongoose";
import { loggerDev } from "./logger.js";

// Asegúrate de que esta URI esté configurada en tus variables de entorno
const URI = config.MONGO_URL

const connectToDB = async () => {
  try {
    await mongoose.connect(URI, {
      tls: true,  // Habilitar TLS/SSL
      ssl: true,
      sslValidate: true,
    });
    loggerDev.info("Connected to DB ecommerce");
  } catch (error) {
    loggerDev.error("Error connecting to DB ecommerce", error);
  }
};

export default connectToDB;