import { Router } from "express";
import { updatePremiumStatus } from "../controllers/users.controller.js";
import { user } from "../controllers/vistas.controller.js";

const usersRouter = Router();

usersRouter.get("/premium/:uid", updatePremiumStatus);

export default usersRouter;
