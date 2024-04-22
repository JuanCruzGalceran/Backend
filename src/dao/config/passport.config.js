import passport from "passport";
import gitgub from "passport-github2";
import local from "passport-local";
import { creaHash, validaPassword } from "../../utils.js";
import { UsuariosManagerMongo } from "../controllers/Mongo/userManagerMongo.js";
const usuariosManager = new UsuariosManagerMongo();

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

          let existe = await usuariosManager.getBy({ email });
          if (existe) {
            return done(null, false);
          }

          let rol = "user";
          if (email === "admincoder@coder.com") {
            rol = "admin";
          }

          password = creaHash(password);
          let nuevoUsuario = await usuariosManager.create({ username, email, password, rol });
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
        clientID: "Iv1.0f4fe73856bf8fb0",
        clientSecret: "293ab27c55ee1d411d91ec6bcbfb44410c9c30fb",
        callbackURL: "http://localhost:8080/api/sessions/callbackGithub",
      },
      async function (accessToken, refreshToken, profile, done) {
        try {
          const name = profile._json.name;
          const email = profile._json.email;
          const usuario = await usuariosManager.getBy({ email });
          if (!usuario) {
            await usuariosManager.create({ username: name, email: email, rol: "user", githubProfile: profile });
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
          console.log({ username });
          let usuario = await usuariosManager.getBy({ email: username });
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
