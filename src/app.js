const express = require("express");
const app = express();
const PORT = 8080;
const productRouter = require("./routes/products.router");
const cartRouter = require("./routes/cart.router");

app.use(express.static(__dirname + "/public"));

app.use(express.json());

app.use("/api/products", productRouter);
app.use("/api/carts", cartRouter);

app.get("/", (req, res) => {
  res.send("Pagina principal");
});

app.use((req, res) => {
  res.status(404).json({ error: "Ruta no encontrada" });
});

app.listen(PORT, () => {
  console.log(`Server on port ${PORT}`);
});
