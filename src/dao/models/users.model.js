import mongoose from "mongoose";

export const usersModel = mongoose.model(
  "users",
  new mongoose.Schema({
    username: String,
    first_name: String,
    last_name: String,
    age: Number,
    cart: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "carts",
      default: null,
    },
    email: {
      type: String,
      unique: true,
    },
    password: String,
    rol: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },
    // {
    //     timestamps: true, strict: false
    // }
  })
);
