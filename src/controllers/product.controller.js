import { routes } from "../utils.js";
// import ProductManager from "../dao/Mongo/productManagerMongo.js";
import { productsModel } from "../dao/models/products.model.js";
import { productRepository } from "../services/services.js";

const rutaProductos = routes.products;
// const products = new ProductManager(rutaProductos);

export const getAllProducts = async (req, res) => {
  let { pagina, limit, query, sort } = req.query;

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

    res.status(200).json({
      status: "success",
      payload: listadeproductos,
      totalPages: totalPages,
      prevPage: prevPage,
      nextPage: nextPage,
      page: page,
      hasPrevPage: hasPrevPage,
      hasNextPage: hasNextPage,
      prevLink: page > 1 ? `/?page=${page - 1}` : null,
      nextLink: page < totalPages ? `/?page=${page + 1}` : null,
    });
  } catch (error) {
    req.logger.error(error);
    res.status(500).send("Error interno del servidor");
  }
};

export const getProductById = async (req, res) => {
  try {
    let productId = req.params.pid;
    let product = await productRepository.getProductById(productId);
    res.json({ product });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

export const addProduct = async (req, res) => {
  try {
    const newProduct = req.body;
    await productRepository.addProduct(newProduct);
    res.status(201).json({ message: "Producto creado correctamente" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const productId = req.params.pid;
    const updatedProduct = req.body;
    await productRepository.updateProduct(productId, updatedProduct);
    res.json({ message: "Producto actualizado correctamente" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const productId = req.params.pid;
    await productRepository.deleteProduct(productId);
    res.json({ message: "Producto eliminado correctamente" });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};
