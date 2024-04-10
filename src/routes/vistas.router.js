import { Router } from "express";
import ProductManager from "../dao/controllers/Mongo/productManagerMongo.js";
import __dirname from "../utils.js";
import { productsModel } from "../dao/models/products.model.js";
import cartModel from "../dao/models/carts.model.js";
import { auth } from "../dao/middlewares/auth.js";
import { admin } from "../dao/middlewares/auth.js";

const products = new ProductManager();
const vistasRouter = Router();

vistasRouter.get("/products", auth, async (req, res) => {
  let { pagina, limit, query, sort } = req.query;
  let usuario = req.session.usuario;
  const isAdmin = usuario.rol === "admin";

  if (!pagina) {
    pagina = 1;
  }

  if (!limit) {
    limit = 6;
  }

  let filter = {};
  if (query && query !== "") {
    filter = { category: query };
  }

  switch (sort) {
    case "asc":
      sort = { price: 1 };
      break;
    case "desc":
      sort = { price: -1 };
      break;
    default:
      sort = undefined;
      break;
  }

  try {
    let {
      docs: listadeproductos,
      totalPages,
      prevPage,
      nextPage,
      page,
      hasPrevPage,
      hasNextPage,
    } = await productsModel.paginate(filter, { limit: limit, page: pagina, sort: sort, lean: true });

    res.setHeader("Content-Type", "text/html");
    res.status(200).render("home", {
      status: "success",
      payload: listadeproductos,
      usuario,
      isAdmin,
      totalPages,
      prevPage,
      nextPage,
      page,
      hasPrevPage,
      hasNextPage,
      prevLink: page > 1 ? `/?page=${page - 1}` : null,
      nextLink: page < totalPages ? `/?page=${page + 1}` : null,
      listadeproductos,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error interno del servidor");
  }
});

vistasRouter.get("/carts", auth, admin, async (req, res) => {
  try {
    let usuario = req.session.usuario;
    const isAdmin = usuario.rol === "admin";
    const carts = await cartModel.find().populate("products.product", "_id title price description category code stock thumbnail").lean();
    res.setHeader("Content-Type", "text/html");
    res.status(200).render("carts", { carts, usuario, isAdmin });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error interno del servidor");
  }
});

vistasRouter.get("/carts/:cid", auth, admin, async (req, res) => {
  try {
    const cid = req.params.cid;
    let usuario = req.session.usuario;
    const isAdmin = usuario.rol === "admin";
    const cart = await cartModel
      .findById(cid)
      .populate("products.product", "_id title price description category code stock thumbnail")
      .lean();
    const cartTotal = cart.products.reduce((acc, prod) => acc + prod.product.price * prod.quantity, 0);
    console.log(cartTotal);
    res.setHeader("Content-Type", "text/html");
    res.status(200).render("cartDetail", { cart, cartTotal, usuario, isAdmin });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error interno del servidor");
  }
});

vistasRouter.get("/product/:pid", async (req, res) => {
  try {
    let usuario = req.session.usuario;
    const isAdmin = usuario.rol === "admin";
    const productId = req.params.pid;
    const product = JSON.parse(JSON.stringify(await products.getProductById(productId)));
    res.setHeader("Content-Type", "text/html");
    res.status(200).render("productDetail", { product, isAdmin });
  } catch (error) {
    console.error(error);
    res.status(500).send("No se encontro producto");
  }
});

vistasRouter.get("/realtimeproducts", auth, admin, (req, res) => {
  let usuario = req.session.usuario;
  const isAdmin = usuario.rol === "admin";
  res.render("realTimeProducts", { usuario, isAdmin });
});

vistasRouter.get("/chat", (req, res) => {
  res.render("chat");
});

vistasRouter.get("/register", (req, res) => {
  let { error, mensaje } = req.query;
  res.status(200).render("register", { error, mensaje });
});

vistasRouter.get("/", (req, res) => {
  res.status(200).render("login");
});

vistasRouter.get("/user", auth, (req, res) => {
  let usuario = req.session.usuario;
  const isAdmin = usuario.rol === "admin";
  res.status(200).render("user", { usuario, isAdmin });
});

export default vistasRouter;
