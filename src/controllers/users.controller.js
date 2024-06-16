import { usersModel } from "../dao/models/users.model.js";
import { loggerDev } from "../config/logger.js";

export const updatePremiumStatus = async (req, res) => {
  const userId = req.params.uid;

  try {
    const user = await usersModel.findById(userId);
    loggerDev.info("Usuario encontrado:", user.rol);

    if (!user) {
      return res.status(404).json({ error: "No se encontro el usuario" });
    }

    const newRole = user.rol === "user" ? "premium" : "user";
    user.rol = newRole;

    await user.save();
    console.log("req session usuario", req.session.usuario);
    req.session.usuario.rol = newRole;
    loggerDev.info(`Se actualizo el rol del usuario ${userId}`);
    res.status(200).json({ message: "Se actualizo el rol del usuario", user });
  } catch (error) {
    loggerDev.error("Error al actualizar el rol", error);
    res.status(500).json({ error: error.message });
  }
};
