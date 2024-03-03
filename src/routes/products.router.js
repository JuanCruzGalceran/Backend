import express from "express";
import productManager from "../managers/ProductManager.js";
const { Router } = express;
const products = new productManager("./src/data/products.json");

const router = Router();

router.get("/", async (req, res) => {
  try {
    let limit = req.query.limit;
    let productList = limit ? (await products.getProducts()).slice(0, limit) : await products.getProducts();
    res.json({ products: productList });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/:pid", async (req, res) => {
  const productId = parseInt(req.params.pid);
  try {
    const product = await products.getProductById(productId);
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const newProduct = req.body;
    await products.addProduct(newProduct);
    res.status(201).json({ message: "Producto creado correctamente" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put("/:pid", async (req, res) => {
  try {
    const updatedProduct = req.body.product;
    const productId = parseInt(req.params.pid);
    await products.updateProduct(productId, updatedProduct);
    res.status(201).json({ message: "Producto actualizado correctamente" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete("/:pid", async (req, res) => {
  try {
    const productId = parseInt(req.params.pid);
    await products.deleteProduct(productId);
    res.status(201).json({ message: "Producto borrado correctamente" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
