import { Router } from "express";
import passport from "passport";
import { register, login, logout, authenticateFailed, callBackGitHub, getCurrentSession } from "../controllers/sessions.controller.js";

export const router = Router();

router.post("/register", passport.authenticate("register", { failureRedirect: "/api/sessions/autenticatefailed" }), register);

router.post("/login", passport.authenticate("login", { failureRedirect: "/api/sessions/autenticatefailed" }), login);

router.get("/logout", logout);

router.get("/autenticatefailed", authenticateFailed);

router.get("/github", passport.authenticate("github", { failureRedirect: "/api/sessions/autenticatefailed" }), (req, res) => {});

router.get("/callbackGithub", passport.authenticate("github", { failureRedirect: "/api/sessions/autenticatefailed" }), callBackGitHub);

router.get("/current", getCurrentSession);
