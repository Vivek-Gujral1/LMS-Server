import {Router} from "express"
import { verifyJWT } from "../middlewares/auth.middelware"
import { uploadVideoBoth } from "../middlewares/multer"
import { uploadVideo } from "../contollers/video.controller"
import { body } from "express-validator"

const router = Router()

router.route("/upload-video").post(verifyJWT , 
    uploadVideoBoth.fields([
    {name : "video" , maxCount:1}
]) , [
    body("title").notEmpty().withMessage("Title is required"),
    body("description").optional().isString().withMessage("Description must be string if provided"),
    // body("isActive").optional().isBoolean().withMessage("isActive must be boolean")
] , uploadVideo)

export default router