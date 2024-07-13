import { usersModel } from "../models/users.model.js";

export default class UsersManager {
  async create(usuario) {
    let nuevoUsuario = await usersModel.create(usuario);
    return nuevoUsuario.toJSON();
  }

  async getBy(filtro) {
    return await usersModel.findOne(filtro).lean();
  }

  async updateLastConnection(uid) {
    try {
      const user = await usersModel.findById(uid);

      if (!user) {
        return { sucess: false, message: "No se encontro el usuario" };
      }

      user.last_connection = new Date();
      await user.save();
      return { sucess: true, message: "Ultima conexion actualizada correctamente" };
    } catch (error) {
      return { sucess: false, message: "Error al actualizar la ultima conexion" };
    }
  }

  async updateDocuments(uid, documents) {
    try {
      const user = await usersModel.findById(uid);
      if (!user) {
        console.log("El usuario no existe");
        return { success: false, message: "No se encontro el usuario" };
      }

      const namedDocuments = Object.values(documents).map(document => ({
        name: `${document[0].fieldname + "_" + document[0].originalname.split(".")[0]}_${user.email}`,
        reference: document[0].path,
      }));

      user.documents.push(...namedDocuments);
      await user.save();

      console.log("Documentos actualizados correctamente");
      return { success: true, message: "Documentos actualizados correctamente" };
    } catch (error) {
      console.log("Error al actualizar documentos:", error);
      return { success: false, message: "Error al actualizar documentos" };
    }
  }
}
