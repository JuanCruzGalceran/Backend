import { Router } from "express";
import { updatePremiumStatus } from "../controllers/users.controller.js";
import { uploader } from "../utils.js";
import { uploadDocuments, getAllUsers, deleteInactiveUsers, updateUserRole, deleteUser } from "../controllers/users.controller.js";

const usersRouter = Router();

usersRouter.get("/", getAllUsers);
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
usersRouter.delete("/", deleteInactiveUsers);
usersRouter.post("/role/:uid", updateUserRole);
usersRouter.post("/:uid", deleteUser);

export default usersRouter;
