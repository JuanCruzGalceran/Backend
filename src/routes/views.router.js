import { Router } from "express";
import ProductManager from "../managers/ProductManager.js";
import __dirname from "../utils.js";

const products = new ProductManager(__dirname + "/data/products.json");
const viewRouter = Router();

viewRouter.get("/", async (req, res) => {
  const listadeproductos = await products.getProducts();
  res.render("home", { listadeproductos });
});

viewRouter.get("/realtimeproducts", (req, res) => {
  res.render("realTimeProducts");
});

export default viewRouter;
