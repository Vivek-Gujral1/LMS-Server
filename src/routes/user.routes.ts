import {Router} from "express"
import {loginUser, logoutUser, registerUser, verifycode} from "../contollers/user.controller"
import { verifyJWT } from "../middlewares/auth.middelware"

const router = Router()

router.route("/create").post(registerUser)
router.route("/verify").post(verifycode)
router.route("/login").post(loginUser)
router.route("/logout").post(verifyJWT , logoutUser)

export default router