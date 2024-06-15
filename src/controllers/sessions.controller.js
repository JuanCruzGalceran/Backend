import UsersManager from "../dao/Mongo/userManagerMongo.js";
import { usersModel } from "../dao/models/users.model.js";
import { userRepository } from "../services/services.js";
import { creaHash, validaPassword } from "../utils.js";
import { config } from "../config/config.js";
import UserDTO from "../services/dto/users.dto.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { enviarMail } from "../config/mailer.js";
import { loggerDev } from "../config/logger.js";

export const register = async (req, res) => {
  console.log("Registrando usuario");
  let { username, email, password } = req.body;
  if (!username || !email || !password) {
    console.log("Faltan datos");
    return res.redirect("/register?error=Faltan datos");
  }

  try {
    res.redirect(`http://localhost:${config.PORT}/`);
  } catch (error) {
    return res.status(400).json({ error: `Error inseperado` });
  }
};

export const login = async (req, res) => {
  let { email, password } = req.body;
  if (!email || !password) {
    res.setHeader("Content-Type", "application/json");
    return res.status(400).json({ error: `Faltan datos` });
  }

  let usuario = await userRepository.getBy({ email });

  if (!usuario) {
    res.setHeader("Content-Type", "application/json");
    return res.status(401).json({ error: `Credenciales incorrectas` });
  }

  if (usuario.password !== creaHash(password)) {
    if (!validaPassword(usuario, password)) {
      res.setHeader("Content-Type", "application/json");
      return res.status(401).json({ error: "Credenciales incorrectas" });
    }
  }

  usuario = { ...usuario };
  delete usuario.password;
  req.session.usuario = usuario;

  res.setHeader("Content-Type", "application/json");
  res.status(200).json({
    message: "Login correcto",
    usuario,
    // token,
  });
};

export const logout = (req, res) => {
  req.session.destroy(e => {
    if (e) {
      res.setHeader("Content-Type", "application/json");
      return res.status(500).json({
        error: `Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`,
        detalle: `${e.message}`,
      });
    }
  });
  res.setHeader("Content-Type", "application/json");
  res.status(200).json({
    message: "Logout exitoso",
  });
};

export const authenticateFailed = (req, res) => {
  res.setHeader("Content-Type", "application/json");
  return res.status(401).json({ error: `Credenciales incorrectas` });
};

export const callBackGitHub = (req, res) => {
  req.session.usuario = req.user;
  // res.setHeader("Content-Type", "application/json");
  // return res.status(200).json({
  //   message: "Login correcto",
  //   usuario: req.user,
  // });
  return res.redirect(`http://localhost:${config.PORT}/`);
};

export const getCurrentSession = (req, res) => {
  if (req.session.usuario) {
    const usuario = new UserDTO(req.session.usuario);
    res.setHeader("Content-Type", "application/json");
    return res.status(200).json(usuario);
  } else {
    res.setHeader("Content-Type", "application/json");
    return res.status(401).json({ error: `No hay usuario logueado` });
  }
};

export const recoverPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await usersModel.findOne({ email });

    if (!user) {
      loggerDev.error(`Usuario no encontrado con email ${email}`);
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    loggerDev.info(`Usuario encontrado con email ${email}`);

    const token = jwt.sign({ email }, config.SECRET, {
      expiresIn: "1h",
    });

    const subject = "Recuperación de contraseña";
    const message = `<h1>Recuperación de contraseña</h1>
    <p>Para recuperar tu contraseña, haz click en el siguiente enlace:</p>
    <a href="http://localhost:${config.PORT}/reset?token=${token}">Recuperar contraseña</a>`;
    await enviarMail(email, subject, message);
    res.status(200).json({ message: "Email enviado" });
  } catch (error) {
    loggerDev.error("Error al recuperar la contraseña", error);
    return res.status(500).json({ error: "Error inesperado" });
  }
};

export const changePassword = async (req, res) => {
  try {
    const { password } = req.body;
    const token = req.query.token;

    if (!token || typeof token !== "string") {
      loggerDev.error("Token invalido");
      return res.status(400).json({ error: "Token invalido" });
    }

    if (!password || typeof password !== "string") {
      loggerDev.error("Contraseña invalida");
      return res.status(400).json({ error: "Contraseña invalida" });
    }

    try {
      const decoded = jwt.verify(token, config.SECRET);
      console.log("decoded", decoded);
      loggerDev.info("Token verificado", decoded);
      const { email } = decoded;
      const user = await usersModel.findOne({ email });

      if (!user) {
        loggerDev.error("No se encontro el usuario");
        return res.status(401).json({ error: "Credenciales incorrectas" });
      }

      console.log("user", user);
      console.log("password", password);

      const passwordMatch = bcrypt.compareSync(password, user.password);
      if (passwordMatch) {
        loggerDev.error("La nueva contraseña no puede ser igual a la anterior");
        return res.status(400).json({ error: "La nueva contraseña no puede ser igual a la anterior" });
      }

      const hashedPassword = creaHash(password);
      await usersModel.updateOne({ email }, { password: hashedPassword });
      loggerDev.info("Contraseña actualizada");
      return res.status(200).json({ message: "Contraseña actualizada" });
    } catch (error) {
      loggerDev.error("Error al cambiar la contraseña", error);
      if (error.name === "TokenExpiredError") {
        return res.render("forgotpassword", { error: "El token ha expirado" });
      }
      return res.status(400).json({ error: "Error inesperado" });
    }
  } catch (error) {
    loggerDev.error("Error al cambiar la contraseña", error);
    return res.status(400).json({ error: "Error inesperado" });
  }
};
