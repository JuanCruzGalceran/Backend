import { ticketRepository } from "../services/services.js";

export const createTicket = async (req, res) => {
  const userId = req.user._id; // Ajusta según cómo estás manejando el ID del usuario
  const cartId = req.session.usuario.cart.toString();
  try {
    const ticket = await ticketRepository.create(userId, cartId);
    res.status(201).json(ticket);
  } catch (error) {
    res.status(500).json({ error: "Error interno del servidor", details: error.message });
  }
};
