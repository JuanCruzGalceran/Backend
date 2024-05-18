import express from "express";
const cartRouter = express.Router();
import {
  getCarts,
  createCart,
  getCartById,
  addProductToCart,
  deleteProductFromCart,
  updateCart,
  updateProductQuantity,
  emptyCart,
} from "../controllers/cart.controller.js";

import { createTicket } from "../controllers/ticket.controller.js";

// import { createTicket } from "../controllers/ticket.controller.js";

cartRouter.get("/", getCarts);

cartRouter.post("/", createCart);

cartRouter.get("/:cid", getCartById);

cartRouter.post("/:cid/product/:pid", addProductToCart);

cartRouter.delete("/:cid/product/:pid", deleteProductFromCart);

cartRouter.put("/:cid", updateCart);

cartRouter.put("/:cid/product/:pid", updateProductQuantity);

cartRouter.delete("/:cid", emptyCart);

cartRouter.post("/:cid/purchase", createTicket);

export default cartRouter;
