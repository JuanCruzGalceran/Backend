import TicketModel from "../models/ticket.model.js";
import CartModel from "../models/carts.model.js";
import { productsModel } from "../models/products.model.js";
import { usersModel } from "../models/users.model.js";

export default class TicketManager {
  async createTicket(userId, cartId) {
    try {
      const cart = await CartModel.findOne({ _id: cartId });
      if (!cart || cart.products.length === 0) {
        throw new Error("No existe un carrito para el usuario");
      }

      const newTicket = new TicketModel({
        amount: this.calculateTotalAmount(cart.products),
        purchaser: userId,
      });

      const { availableProducts, unavailableProducts } = await this.checkStock(cart.products);

      if (availableProducts.length === 0) {
        throw new Error("No hay stock disponible para los productos seleccionados");
      }

      await this.updateStock(availableProducts);

      await newTicket.save();

      await CartModel.findOneAndUpdate({ _id: cartId }, { $set: { products: unavailableProducts } });

      return { newTicket, unavailableProducts };
    } catch (error) {
      req.logger.error("Error al crear ticket", error);
      throw error;
    }
  }

  async checkStock(products) {
    try {
      const availableProducts = [];
      const unavailableProducts = [];

      for (const item of products) {
        const product = await productsModel.findById(item.product);
        if (product && product.stock >= item.quantity) {
          availableProducts.push(item);
        } else {
          unavailableProducts.push({
            product: item.product,
            quantity: product ? item.quantity - product.stock : item.quantity,
          });
          if (product) {
            item.quantity = product.stock;
            if (product.stock > 0) {
              availableProducts.push(item);
            }
          }
        }
      }
      return { availableProducts, unavailableProducts };
    } catch (error) {
      req.logger.error("Error al verificar stock", error);
      throw error;
    }
  }

  async updateStock(products) {
    try {
      for (const item of products) {
        await productsModel.findByIdAndUpdate(item.product._id, {
          $inc: { stock: -item.quantity },
          $set: { status: item.quantity <= item.stock },
        });
      }
    } catch (error) {
      req.logger.error("Error al actualizar stock", error);
      throw error;
    }
  }

  async getTicketsByUser(userId) {
    try {
      const user = await usersModel.findById(userId);

      if (!user) {
        return [];
      }

      const tickets = await TicketModel.find({ purchaser: userId });

      return tickets;
    } catch (error) {
      req.logger.error("Error al obtener los tickets:", error);
      throw error;
    }
  }

  calculateTotalAmount(products) {
    return products.reduce((total, item) => {
      const price = item.product.price;
      const quantity = item.quantity;
      return total + price * quantity;
    }, 0);
  }

  async getLatestTicketByUser(userId) {
    try {
        const latestTicket = await TicketModel.findOne({ purchaser: userId })
            .sort({ createdAt: -1 })
            .lean();
        return latestTicket;
    } catch (error) {
        console.error("Error al obtener el último ticket del usuario:", error);
        throw error;
    }
}
}
