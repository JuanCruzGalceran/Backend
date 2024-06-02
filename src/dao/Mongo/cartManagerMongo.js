import CartModel from "../models/carts.model.js";

class CartManager {
  async createCart() {
    try {
      const newCart = new CartModel({ products: [] });
      await newCart.save();
      return newCart;
    } catch (error) {
      req.logger.error("Error al crear carrito", error);
      throw error;
    }
  }

  async getCarts() {
    try {
      const carts = await CartModel.find().populate("products.product", "_id title price description category code stock thumbnail");
      return carts;
    } catch (err) {
      req.logger.error("Error al obtener los carritos:", err.message);
      return [];
    }
  }

  async getCartById(cartId) {
    try {
      const cart = await CartModel.findById(cartId);

      if (!cart) {
        throw new Error(`No existe un carrito con el id ${cartId}`);
      }

      return cart;
    } catch (error) {
      req.logger.error("Error al obtener el carrito por ID", error);
      throw error;
    }
  }

  async addProductToCart(cartId, productId, quantity = 1) {
    try {
      const cart = await this.getCartById(cartId);
      const existeProducto = cart.products.find(item => item.product?.equals(productId));

      if (existeProducto) {
        existeProducto.quantity += quantity;
      } else {
        cart.products.push({ product: productId, quantity });
      }

      cart.markModified("products");
      await cart.save();
      return cart;
    } catch (error) {
      req.logger.error("Error al agregar un producto al carrito", error);
      throw error;
    }
  }

  async deleteProductFromCart(cartId, productId) {
    try {
      let cart = await CartModel.findById(cartId);
      if (!cart) {
        throw new Error("Carrito no encontrado");
      }
      cart.products = cart.products.filter(product => !product.product.equals(productId));
      await cart.save();
      return cart;
    } catch (error) {
      req.logger.error("Error al eliminar el producto del carrito en cartManager", error);
      throw error;
    }
  }

  async updateCart(cartId, updatedProducts) {
    try {
      let cart = await CartModel.findById(cartId);
      if (!cart) {
        throw new Error("Carrito no encontrado");
      }
      cart.products = updatedProducts;
      cart.markModified("products");
      await cart.save();
      return cart;
    } catch (error) {
      req.logger.error("Error al actualizar el carrito en cartManager", error);
      throw error;
    }
  }

  async updateProductQuantity(cartId, productId, newQuantity) {
    try {
      let cart = await CartModel.findById(cartId);
      if (!cart) {
        throw new Error("Carrito no encontrado");
      }
      const productIndex = cart.products.findIndex(item => item.product.equals(productId));
      if (productIndex !== -1) {
        cart.products[productIndex].quantity = newQuantity;

        cart.markModified("products");
        await cart.save();
        return cart;
      } else {
        throw new Error("Producto no encontrado en el carrito");
      }
    } catch (error) {
      req.logger.error("Error al actualizar la cantidad del producto en carrito desde cart manager", error);
      throw error;
    }
  }

  async emptyCart(cartId) {
    try {
      let cart = await CartModel.findByIdAndUpdate(cartId, { products: [] }, { new: true });
      if (!cart) {
        throw new Error("Carrito no encontrado");
      }
      return cart;
    } catch (error) {
      req.logger.error("Error al vaciar el carrito desde cart manager", error);
      throw error;
    }
  }
}

export default CartManager;
