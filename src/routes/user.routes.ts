import { Router } from "express";
import {
  loginUser,
  logoutUser,
  refreshTooken,
  registerUser,
  verifycode,
} from "../contollers/user.controller";
import { verifyJWT } from "../middlewares/auth.middelware";

const router = Router();

router.route("/create").post(registerUser);
router.route("/verify").post(verifycode);
router.route("/login").post(loginUser);
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/refreh-access-token").post(refreshTooken);

export default router;
