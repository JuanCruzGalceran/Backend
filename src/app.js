import __dirname from "./utils.js";
import path from "path";
import express from "express";
import { Server } from "socket.io";
import { engine } from "express-handlebars";
import handlebars from "express-handlebars";
import productRouter from "./routes/products.router.js";
import cartRouter from "./routes/cart.router.js";
import viewsRouter from "./routes/views.router.js";
import socketProducts from "./listeners/socketProducts.js";
import socketChat from './listeners/socketChat.js';
import connectToDB from "./dao/config/configServer.js";

const app = express();
const PORT = 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));

app.engine("handlebars", handlebars.engine());
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));

app.use("/api/products", productRouter);
app.use("/api/carts", cartRouter);
app.use("/", viewsRouter);

connectToDB()

app.use((req, res) => {
  res.status(404).json({ error: "Ruta no encontrada" });
});

const http = app.listen(PORT, () => {
  console.log(`Server on port ${PORT}`);
});

const io = new Server(http)

socketProducts(io)
socketChat(io)
