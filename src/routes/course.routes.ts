import { Router } from "express";
import { CheckExistingCourseByUser, createCourse, getUserCourses } from "../contollers/course.controller";
import { verifyJWT } from "../middlewares/auth.middelware";
import { upload } from "../middlewares/multer.middleware";

const router = Router()

router.route("/check-course-name").get( verifyJWT,CheckExistingCourseByUser)
router.route("/create-course").post( verifyJWT , upload.single("image") ,createCourse)
router.route("/get-user-courses").get(verifyJWT , getUserCourses)

export default router