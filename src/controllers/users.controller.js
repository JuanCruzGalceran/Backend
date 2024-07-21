import { usersModel } from "../dao/models/users.model.js";
import { loggerDev } from "../config/logger.js";
import { userRepository } from "../services/services.js";
import UserDTO from "../services/dto/users.dto.js"
import { enviarMail } from "../config/mailer.js"


export const updatePremiumStatus = async (req, res) => {
  const userId = req.params.uid;

  try {
    const user = await usersModel.findById(userId);
    loggerDev.info("Usuario encontrado:", user.rol);

    if (!user) {
      return res.status(404).json({ error: "No se encontro el usuario" });
    }

    if(user.rol === "user") {            
      const requiredDocuments = ["identificacion", "comprobanteDeDomicilio", "comprobanteDeEstadoDeCuenta"];
      const userDocuments = user.documents.map(doc => doc.name.split('_')[0]);
      console.log("Documentos del usuario:", userDocuments);

      const hasAllDocuments = requiredDocuments.every(doc => userDocuments.includes(doc));
      if (!hasAllDocuments) {
          console.log("No hay documentos");
          return res.status(400).json({ message: "El usuario debe cargar todos los documentos requeridos antes de actualizar su rol a premium" });
      }
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

export const uploadDocuments = async (req, res) => {
  try {
    const userId = req.params.uid;
    const documents = req.files
    console.log("Documentos recibidos:", documents);

    const updateResult = await userRepository.updateDocuments(userId, documents);

    if (!updateResult.success) {
      return res.status(404).json({ message: updateResult.message });
    }

    res.status(200).json({ message: "Documentos subidos correctamente" });
  } catch (error) {
    loggerDev.error("Error al subir documentos:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

export const getAllUsers = async (req, res) => {
  try {
      const users = await usersModel.find({}, 'first_name last_name email rol'); 
      const usersDTO = users.map(user => new UserDTO(user.toObject())); 
      res.status(200).json(usersDTO);
  } catch (error) {
      loggerDev.error("Error al obtener los usuarios", error);
      res.status(500).json({ error: "Error interno del servidor" });
  }
};

export const deleteInactiveUsers = async (req, res) => {
  try {
      const twoDaysAgo = new Date();
      twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

      const inactiveUsers = await usersModel.find({
          $or: [
              { last_connection: { $exists: true, $lt: twoDaysAgo } },
              { last_connection: { $exists: false } }
          ]
      });

      if (inactiveUsers.length === 0) {
          return res.status(200).json({ message: "No hay usuarios inactivos para eliminar." });
      }

      const emailsToDelete = inactiveUsers.map(user => user.email);

      for (const email of emailsToDelete) {
          await enviarMail(email, "Cuenta inactiva", "Su cuenta ha sido eliminada por inactividad.");
      }

      await usersModel.deleteMany({ _id: { $in: inactiveUsers.map(user => user._id) } });

      loggerDev.info(`Usuarios eliminados: ${inactiveUsers.length}`);
      res.status(200).json({ message: `Se han eliminado ${inactiveUsers.length} usuarios inactivos.` });
  } catch (error) {
      loggerDev.error("Error al eliminar usuarios inactivos", error);
      res.status(500).json({ error: "Error interno del servidor" });
  }
};

export const updateUserRole = async (req, res) => {
  const userId = req.params.uid;
  const newRole = req.body.rol;

  try {
      const user = await usersModel.findById(userId);

      if (!user) {
          return res.status(404).send("Usuario no encontrado");
      }

      user.rol = newRole;
      await user.save();
      loggerDev.info(`Rol del usuario ${userId} actualizado a ${newRole}`);
      res.redirect("/adminusers");
  } catch (error) {
      loggerDev.error("Error al actualizar el rol del usuario", error);
      res.status(500).send("Error interno del servidor");
  }
};

export const deleteUser = async (req, res) => {
  const userId = req.params.uid;

  try {
      const user = await usersModel.findByIdAndDelete(userId);

      if (!user) {
          return res.status(404).send("Usuario no encontrado");
      }

      loggerDev.info(`Usuario ${userId} eliminado`);
      res.redirect("/adminusers");
  } catch (error) {
      loggerDev.error("Error al eliminar el usuario", error);
      res.status(500).send("Error interno del servidor");
  }
};