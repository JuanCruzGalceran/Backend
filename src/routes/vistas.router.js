import { Router } from "express";
import { admin, auth, isUser } from "../middlewares/auth.js";
import {
  getProducts,
  getAllCarts,
  getCartById,
  getProductById,
  realTimeProducts,
  chat,
  register,
  login,
  user,
  cart,
  mocks,
  recover,
  reset
} from "../controllers/vistas.controller.js";

const vistasRouter = Router();

vistasRouter.get("/products", auth, isUser, getProducts);

vistasRouter.get("/carts", auth, admin, getAllCarts);

vistasRouter.get("/carts/:cid", auth, admin, getCartById);

vistasRouter.get("/product/:pid", getProductById);

vistasRouter.get("/realtimeproducts", auth, admin, realTimeProducts);

vistasRouter.get("/chat", isUser, chat);

vistasRouter.get("/register", register);

vistasRouter.get("/", login);

vistasRouter.get("/user", auth, user);

vistasRouter.get("/cart", auth, cart);

vistasRouter.get("/mockingproducts", mocks);

vistasRouter.get("/recover", recover);

vistasRouter.get("/reset" , reset)

export default vistasRouter;
