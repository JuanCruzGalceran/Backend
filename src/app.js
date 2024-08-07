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
import connectToDB from "./config/configServer.js";
import session from "express-session";
import MongoStore from "connect-mongo";
import { initPassport } from "./config/passport.config.js";
import passport from "passport";
import jwt from "jsonwebtoken";
import { config } from "./config/config.js";
import { addLogger, loggerDev } from "./config/logger.js";
import loggerRouter from "./routes/loggers.router.js";
import usersRouter from "./routes/users.router.js";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUIExpress from "swagger-ui-express";

const PORT = config.PORT;

const app = express();

app.use(addLogger);

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
      mongoUrl: config.MONGO_URL,
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
app.use("/api/users", usersRouter);
app.use("/loggerTest", loggerRouter);
app.use("/", vistasRouter);

const swaggerOptions = {
  definition: {
    openapi: "3.0.1",
    info: {
      title: "Documentacion",
      description: "Documentacion de la API",
    },
  },
  apis: [`./src/docs/*.yaml`],
};

const specs = swaggerJSDoc(swaggerOptions);
app.use("/apidocs", swaggerUIExpress.serve, swaggerUIExpress.setup(specs));

connectToDB();

app.use((req, res) => {
  res.status(404).json({ message: "Not found" });
});

const http = app.listen(PORT, () => {
  loggerDev.info(`Server on port ${PORT}`);
});

const io = new Server(http);

socketProducts(io);
socketChat(io);
