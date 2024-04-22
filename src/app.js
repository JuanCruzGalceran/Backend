import __dirname from "./utils.js";
import path from "path";
import express from "express";
import { Server } from "socket.io";
import { engine } from "express-handlebars";
import productRouter from "./routes/product.router.js";
import cartRouter from "./routes/cart.router.js";
import vistasRouter from "./routes/vistas.router.js";
import { router as sessionsRouter } from "./routes/sessions.router.js";
import socketProducts from "./listeners/socketProducts.js";
import socketChat from "./listeners/socketChat.js";
import connectToDB from "./dao/config/configServer.js";
import session from "express-session";
import MongoStore from "connect-mongo";
import { initPassport } from "./dao/config/passport.config.js";
import passport from "passport";
import jwt from "jsonwebtoken";

const PORT = 8080;
const app = express();

app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "/views"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: "CoderCoder123",
    resave: true,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl: "mongodb+srv://gjuancruz:juankadel77@cluster0.hspesbp.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=Cluster0",
      ttl: 3000,
    }),
  })
);

initPassport();
app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(path.join(__dirname, "/public")));

app.use("/api/products", productRouter);
app.use("/api/carts", cartRouter);
app.use("/api/sessions", sessionsRouter);
app.use("/", vistasRouter);

connectToDB();

app.use((req, res) => {
  res.status(404).json({ error: "Ruta no encontrada" });
});

const http = app.listen(PORT, () => {
  console.log(`Server on port ${PORT}`);
});

const io = new Server(http);

socketProducts(io);
socketChat(io);
