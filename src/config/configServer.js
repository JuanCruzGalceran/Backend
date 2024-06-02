import mongoose from "mongoose";
import { loggerDev } from "./logger.js";

const URI = "mongodb+srv://gjuancruz:juankadel77@cluster0.hspesbp.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=Cluster0";
const connectToDB = () => {
  try {
    mongoose.connect(URI);
    loggerDev.info("connected to DB ecommerce");
  } catch (error) {
    loggerDev.error(error);
  }
};

export default connectToDB;
