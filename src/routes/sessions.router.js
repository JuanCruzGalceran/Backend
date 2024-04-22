import { Router } from "express";
import { UsuariosManagerMongo } from "../dao/controllers/Mongo/userManagerMongo.js";
import { creaHash, validaPassword } from "../utils.js";
export const router = Router();
import passport from "passport";
import jwt from "jsonwebtoken";

let usuariosManager = new UsuariosManagerMongo();

router.post("/register", passport.authenticate("register", { failureRedirect: "/api/sessions/autenticatefailed" }), async (req, res) => {
  let { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.redirect("/register?error=Faltan datos");
  }

  // let userAlreadyCreated = await usuariosManager.getBy({ email });
  // if (userAlreadyCreated) {
  //   return res.redirect(`/register?error=Ya existen usuarios con email ${email}`);
  // }

  // let rol = "user";
  // if (email === "admincoder@coder.com") {
  //   rol = "admin";
  // }
  // password = creaHash(password);

  try {
    // console.log("Creando usuario");
    // await usuariosManager.create({ username, email, password, rol });
    // res.setHeader("Content-Type", "application/json");
    res.redirect("http://localhost:8080/");
  } catch (error) {
    return res.status(400).json({ error: `Error inseperado` });
  }
});

router.post("/login", passport.authenticate("login", { failureRedirect: "/api/sessions/autenticatefailed" }), async (req, res) => {
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

  // let token = jwt.sign(usuario, SECRET, { expiresIn: "1h" });

  res.setHeader("Content-Type", "application/json");
  res.status(200).json({
    message: "Login correcto",
    usuario,
    // token,
  });
});

router.get("/logout", (req, res) => {
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
});

router.get("/autenticatefailed", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  return res.status(401).json({ error: `Credenciales incorrectas` });
});

router.get("/github", passport.authenticate("github", { failureRedirect: "/api/sessions/autenticatefailed" }), (req, res) => {
  console.log("aaaaaaaaaaaaaaaaaa");
});

router.get("/callbackGithub", passport.authenticate("github", { failureRedirect: "/api/sessions/autenticatefailed" }), (req, res) => {
  req.session.usuario = req.user;
  // res.setHeader("Content-Type", "application/json");
  // return res.status(200).json({
  //   message: "Login correcto",
  //   usuario: req.user,
  // });
  return res.redirect("http://localhost:8080/products");
});
