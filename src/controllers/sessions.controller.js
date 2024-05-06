import { UsuariosManagerMongo } from "../dao/Mongo/userManagerMongo.js";
import { creaHash, validaPassword } from "../utils.js";
import { config } from "../config/config.js";

let usuariosManager = new UsuariosManagerMongo();

export const register = async (req, res) => {
  let { username, email, password } = req.body;
  if (!username || !email || !password) {
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

  let usuario = await usuariosManager.getBy({ email });

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
    res.setHeader("Content-Type", "application/json");
    return res.status(200).json(req.session.usuario);
  } else {
    res.setHeader("Content-Type", "application/json");
    return res.status(401).json({ error: `No hay usuario logueado` });
  }
};
