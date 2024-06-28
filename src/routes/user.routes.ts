import { Router } from "express";
import {
  chechEmailUnique,
  getCurrentUser,
  loginUser,
  logoutUser,
  refreshTooken,
  registerUser,
  uploadAvatar,
  verifycode,
} from "../contollers/user.controller";
import { verifyJWT } from "../middlewares/auth.middelware";
import { upload } from "../middlewares/multer.middleware";

const router = Router();

router.route("/register").post(registerUser);
router.route("/verify").post(verifycode);
router.route("/login").post(loginUser);
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/refreh-access-token").post(refreshTooken);
router.route("/check-email-unique").get(chechEmailUnique);
router.route("/get-current-user").get(verifyJWT, getCurrentUser);
router
  .route("/upload-avatar")
  .patch(verifyJWT, upload.single("avatar"), uploadAvatar);

export default router;
