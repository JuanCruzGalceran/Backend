import passport from "passport";
import gitgub from "passport-github2";
import local from "passport-local";
import { creaHash, validaPassword } from "../utils.js";
// import CartManager from "../dao/Mongo/cartManagerMongo.js";
// import UsersManager from "../dao/Mongo/userManagerMongo.js";
import { userRepository, cartRepository } from "../services/services.js";
import { config } from "./config.js";
// const usuariosManager = new UsersManager();
// const cartManager = new CartManager();

export const initPassport = () => {
  passport.use(
    "register",
    new local.Strategy(
      {
        usernameField: "email",
        passReqToCallback: true,
      },
      async function (req, username, password, done) {
        try {
          let { username, email } = req.body;
          if (!username || !email) {
            return done(null, false);
          }

          let existe = await userRepository.getBy({ email });
          if (existe) {
            return done(null, false);
          }

          let rol = "user";
          if (email === "admincoder@coder.com") {
            rol = "admin";
          }

          const newCart = await cartRepository.createCart();
          const cartId = newCart._id;

          password = creaHash(password);
          let nuevoUsuario = await userRepository.create({
            username,
            email,
            password,
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            age: req.body.age,
            cart: cartId,
            rol,
          });

          return done(null, nuevoUsuario);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.use(
    "github",
    new gitgub.Strategy(
      {
        clientID: config.CLIENTID,
        clientSecret: config.CLIENTSECRET,
        callbackURL: config.CALLBACKURL,
      },
      async function (accessToken, refreshToken, profile, done) {
        try {
          const name = profile._json.name;
          const email = profile._json.email;
          const usuario = await userRepository.getBy({ email });
          if (!usuario) {
            await userRepository.create({ username: name, email: email, rol: "user", githubProfile: profile });
          }
          return done(null, usuario);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.use(
    "login",
    new local.Strategy(
      {
        usernameField: "email",
      },
      async (username, password, done) => {
        try {
          let usuario = await userRepository.getBy({ email: username });
          if (!usuario) {
            return done(null, false);
          }

          if (!validaPassword(usuario, password)) {
            return done(null, false);
          }

          return done(null, usuario);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  // 1) solo si se usan sesiones
  passport.serializeUser((user, done) => {
    return done(null, user);
  });

  passport.deserializeUser((user, done) => {
    return done(null, user);
  });
};
