import {Router} from "express"
import {registerUser, verifycode} from "../contollers/user.controller"

const router = Router()

router.route("/create").post(registerUser)
router.route("/verify").post(verifycode)

export default router