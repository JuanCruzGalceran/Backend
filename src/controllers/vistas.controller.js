// import ProductManager from "../dao/Mongo/productManagerMongo.js";
import { productRepository } from "../services/services.js";
import { productsModel } from "../dao/models/products.model.js";
import cartModel from "../dao/models/carts.model.js";
import __dirname from "../utils.js";
import { generateMockProducts } from "../mocks/mocks.js";

// const products = new ProductManager();

export const getProducts = async (req, res) => {
  let { pagina, limit, query, sort } = req.query;
  let usuario = req.session.usuario;
  const isAdmin = usuario.rol === "admin";
  const isUser = usuario.rol === "user";
  const cartId = req.session.usuario.cart.toString();

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
      cartId,
      usuario,
      isAdmin,
      isUser,
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
};

export const getAllCarts = async (req, res) => {
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
};

export const getCartById = async (req, res) => {
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
};

export const getProductById = async (req, res) => {
  try {
    let usuario = req.session.usuario;
    const isAdmin = usuario.rol === "admin";
    const productId = req.params.pid;
    const cartId = req.session.usuario.cart.toString();
    const product = JSON.parse(JSON.stringify(await productRepository.getProductById(productId)));
    res.setHeader("Content-Type", "text/html");
    res.status(200).render("productDetail", { product, isAdmin, cartId });
  } catch (error) {
    console.error(error);
    res.status(500).send("No se encontro producto");
  }
};

export const realTimeProducts = async (req, res) => {
  let usuario = req.session.usuario;
  const isAdmin = usuario.rol === "admin";
  res.render("realTimeProducts", { usuario, isAdmin });
};

export const chat = (req, res) => {
  res.render("chat");
};

export const register = (req, res) => {
  let { error, mensaje } = req.query;
  res.status(200).render("register", { error, mensaje });
};

export const login = (req, res) => {
  res.status(200).render("login");
};

export const user = (req, res) => {
  let usuario = req.session.usuario;
  const isAdmin = usuario.rol === "admin";
  const isUser = usuario.rol === "user";
  res.status(200).render("user", { usuario, isAdmin, isUser });
};

export const cart = async (req, res) => {
  let usuario = req.session.usuario;
  const isAdmin = usuario.rol === "admin";
  const isUser = usuario.rol === "user";
  const cartId = req.session.usuario.cart;
  const userCart = await cartModel
    .findById(cartId)
    .populate("products.product", "_id title price description category code stock thumbnail")
    .lean();
  res.status(200).render("cart", { userCart, usuario, isAdmin, isUser, cartId });
};

export const mocks = (req, res) => {
  const mockProducts = generateMockProducts();
  const cartId = req.session.usuario.cart;
  res.status(200).render("mock", { products: mockProducts, cartId });
};
