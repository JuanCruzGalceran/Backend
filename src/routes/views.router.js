import { Router } from "express";
import ProductManager from "../dao/controllers/Mongo/productManagerMongo.js";
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

viewRouter.get("/chat",(req,res)=>{
  res.render("chat")
})

export default viewRouter;
