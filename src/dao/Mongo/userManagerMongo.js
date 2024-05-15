import { usersModel } from "../models/users.model.js";

export default class UsersManager {
  async create(usuario) {
    let nuevoUsuario = await usersModel.create(usuario);
    return nuevoUsuario.toJSON();
  }

  async getBy(filtro) {
    return await usersModel.findOne(filtro).lean();
  }
}
