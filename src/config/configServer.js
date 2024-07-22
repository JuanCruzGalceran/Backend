import mongoose from "mongoose";
import { loggerDev } from "./logger.js";

// Asegúrate de que esta URI esté configurada en tus variables de entorno
const URI = process.env.MONGO_URL || "mongodb+srv://gjuancruz:juankadel77@cluster0.hspesbp.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=Cluster0";

const connectToDB = async () => {
  try {
    await mongoose.connect(URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      tls: true,  // Habilitar TLS/SSL
      tlsCAFile: '/path/to/ca.pem',  // Ruta al certificado CA si es necesario
    });
    loggerDev.info("Connected to DB ecommerce");
  } catch (error) {
    loggerDev.error("Error connecting to DB ecommerce", error);
  }
};

export default connectToDB;