// import ProductManager from "../dao/Mongo/productManagerMongo.js";
import { productRepository, ticketRepository } from "../services/services.js";
import { productsModel } from "../dao/models/products.model.js";
import cartModel from "../dao/models/carts.model.js";
import __dirname from "../utils.js";
import { generateMockProducts } from "../mocks/mocks.js";
import errorsDictionary from "../services/errors/errors-dictionary.js";
import CustomError from "../services/errors/customError.js";
import { usersModel } from "../dao/models/users.model.js";


// const products = new ProductManager();

export const getProducts = async (req, res) => {
  let { pagina, limit, query, sort } = req.query;
  let usuario = req.session.usuario;
  const isAdmin = usuario.rol === "admin";
  const isUser = usuario.rol === "user";
  const isPremium = usuario.rol === "premium";
  const cartId = req.session.usuario.cart.toString();
  const userId = req.session.usuario._id;
  const email = req.session.usuario.email;

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
      isPremium,
      userId,
      email,
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
    req.logger.error(error);
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
    req.logger.error(error);
    res.status(500).send("Error interno del servidor");
  }
};

export const getCartById = async (req, res, next) => {
  try {
    const cid = req.params.cid;
    let usuario = req.session.usuario;
    const isAdmin = usuario.rol === "admin";
    const cart = await cartModel
      .findById(cid)
      .populate("products.product", "_id title price description category code stock thumbnail")
      .lean();

    if (!cart) {
      throw new CustomError(errorsDictionary.CART_NOT_FOUND, "Carrito no encontrado");
    }

    const cartTotal = cart.products.reduce((acc, prod) => acc + prod.product.price * prod.quantity, 0);
    req.logger.info(cartTotal);
    res.setHeader("Content-Type", "text/html");
    res.status(200).render("cartDetail", { cart, cartTotal, usuario, isAdmin });
  } catch (error) {
    next(error);
  }
};

export const getProductById = async (req, res) => {
  try {
    let usuario = req.session.usuario;
    const isAdmin = usuario.rol === "admin";
    const productId = req.params.pid;
    const cartId = req.session.usuario.cart.toString();
    const product = JSON.parse(JSON.stringify(await productRepository.getProductById(productId)));
    const email = req.session.usuario.email;
    console.log("email", email);
    console.log("product", product);
    res.setHeader("Content-Type", "text/html");
    res.status(200).render("productDetail", { product, isAdmin, cartId, email });
  } catch (error) {
    req.logger.error(error);
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
  console.log(usuario);
  const isAdmin = usuario.rol === "admin";
  const isUser = usuario.rol === "user";
  const isPremium = usuario.rol === "premium";
  const rol = usuario.rol;
  const userId = usuario._id;
  res.status(200).render("user", { usuario, isAdmin, isUser, rol, userId, isPremium });
};

export const cart = async (req, res) => {
  let usuario = req.session.usuario;
  const isAdmin = usuario.rol === "admin";
  const isUser = usuario.rol === "user";
  const isPremium = usuario.rol === "premium";
  const cartId = req.session.usuario.cart;
  const userCart = await cartModel
    .findById(cartId)
    .populate("products.product", "_id title price description category code stock thumbnail")
    .lean();
  res.status(200).render("cart", { userCart, usuario, isAdmin, isUser, cartId, isPremium });
};

export const mocks = (req, res) => {
  const mockProducts = generateMockProducts();
  const cartId = req.session.usuario.cart;
  res.status(200).render("mock", { products: mockProducts, cartId });
};

export const recover = (req, res) => {
  res.render("forgotPassword");
};

export const reset = (req, res) => {
  const token = req.query.token;
  res.render("resetPassword", { token });
};

export const rol = (req, res) => {
  let user = req.session.usuario;
  let rol = user.rol;
  let uid = user._id;
  res.status(200).render("rol", { rol, uid });
};

export const premium = async (req, res) => {
  let datoUsuario = req.session.usuario._id;
  let usuario = await usersModel.findById(datoUsuario);
  let rol = usuario.rol;
  let uid = usuario._id;
  let email = usuario.email;
  const isAdmin = usuario.rol === "admin";
  const isUser = usuario.rol === "user";
  const isPremium = usuario.rol === "premium";
  const productos = await productsModel.find({ owner: email }).lean();
  res.status(200).render("premium", { usuario, productos, rol, uid, isAdmin, isUser, isPremium });
};

export const adminUsers = async (req, res) => {
  try {
      const users = await usersModel.find().lean();  
      res.render("adminUsers", { users }); 
  } catch (error) {
      loggerDev.error("Error al obtener los usuarios", error);
      res.status(500).send("Error interno del servidor");
  }
};

export const details = async (req, res) => {
  try {
      const userId = req.user._id;
      const latestTicket = await ticketRepository.getLatestTicketByUser(userId);

      if (latestTicket) {
          res.render('details', { ticket: latestTicket, user: req.user });
      } else {
          res.status(404).send('No se encontró ningún ticket para este usuario.');
      }
  } catch (error) {
      req.logger.error('Error al obtener los detalles del último ticket:', error);
      res.status(500).send('Error interno del servidor');
  }
};