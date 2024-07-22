import mongoose from "mongoose";
import { loggerDev } from "./logger.js";
const URI = config.MONGO_URL;

const connectToDB = async () => {
  try {
    await mongoose.connect(URI);
    loggerDev.info("Connected to DB ecommerce");
  } catch (error) {
    loggerDev.error("Error connecting to DB ecommerce", error);
  }
};

export default connectToDB;
