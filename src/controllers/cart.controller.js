import CartManager from "../dao/Mongo/cartManagerMongo.js";
import CartModel from "../dao/models/carts.model.js";

const cartManager = new CartManager();

export const getCarts = async (req, res) => {
  try {
    res.json({ carts: await cartManager.getCarts() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createCart = async (req, res) => {
  try {
    let newCart = await cartManager.createCart();
    res.json(newCart);
  } catch (error) {
    console.error("Error al crear nuevo carrito", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

export const getCartById = async (req, res) => {
  let cartId = req.params.cid;

  try {
    const cart = await CartModel.findById(cartId);
    if (!cart) {
      console.log("No existe el carrito con ese id");
      return res.status(404).json({ error: "Carrito no encontrado" });
    }
    const productsInCart = cart.products.map(item => ({
      product: item.product.toObject(),
      quantity: item.quantity,
    }));
    res.json({ cart });
    // res.render("carts", { products: productsInCart });
  } catch (error) {
    console.error("Error al obtener carrito", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

export const addProductToCart = async (req, res) => {
  let cartId = req.params.cid;
  let productId = req.params.pid;
  let quantity = req.body.quantity || 1;

  try {
    const updateCart = await cartManager.addProductToCart(cartId, productId, quantity);
    res.json(updateCart.products);
  } catch (error) {
    console.error("Error al agregar producto", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

export const deleteProductFromCart = async (req, res) => {
  try {
    let cartId = req.params.cid;
    let productId = req.params.pid;
    const updateCart = await cartManager.deleteProductFromCart(cartId, productId);
    res.json({
      status: "success",
      message: "Producto eliminado del carrito correctamente",
      updateCart,
    });
  } catch (error) {
    console.error("Error al eliminar el producto del carrito en cart.router", error);
    res.status(500).json({
      status: "error",
      error: "Error del servidor",
    });
  }
};

export const updateCart = async (req, res) => {
  let cartId = req.params.cid;
  let updatedProducts = req.body;
  try {
    let updatedCart = await cartManager.updateCart(cartId, updatedProducts);
    res.json(updatedCart);
  } catch (error) {
    console.error("Error al actualizar el carrito en cart.router", error);
    res.status(500).json({
      status: "error",
      error: "Error interno del servidor",
    });
  }
};

export const updateProductQuantity = async (req, res) => {
  try {
    let cartId = req.params.cid;
    let productId = req.params.pid;
    const newQuantity = req.body.quantity;
    let updatedCart = await cartManager.updateProductQuantity(cartId, productId, newQuantity);
    res.json({
      status: "success",
      message: "Cantidad del producto actualizada correctamente",
      updatedCart,
    });
  } catch (error) {
    console.error("Error al actualizar la cantidad del producto en el carrito desde cart.router", error);
    res.status(500).json({
      status: "error",
      error: "Error interno del servidor",
    });
  }
};

export const emptyCart = async (req, res) => {
  try {
    let cartId = req.params.cid;
    let updatedCart = await cartManager.emptyCart(cartId);
    res.json({
      status: "success",
      message: "Todos los productos del carrito fueron eliminados correctamente",
      updatedCart,
    });
  } catch (error) {
    console.error("Error al vaciar el carrito desde cart router", error);
    res.status(500).json({
      status: "error",
      error: "Error interno del servidor",
    });
  }
};
