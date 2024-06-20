import {Router} from "express"
import {registerUser} from "../contollers/user.controller"

const router = Router()

router.route("/create").post(registerUser)

export default router