import { Router } from "express";
import { updatePremiumStatus } from "../controllers/users.controller.js";
import { uploader } from "../utils.js";
import { uploadDocuments } from "../controllers/users.controller.js";

const usersRouter = Router();

usersRouter.get("/premium/:uid", updatePremiumStatus);
usersRouter.post(
  "/:uid/documents",
  uploader.fields([
    { name: "identificacion", maxCount: 1 },
    { name: "comprobanteDeDomicilio", maxCount: 1 },
    { name: "comprobanteDeEstadoDeCuenta", maxCount: 1 },
  ]),
  uploadDocuments
);

export default usersRouter;
