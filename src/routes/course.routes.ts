import { Router } from "express";
import { CheckExistingCourseByUser, createCourse } from "../contollers/course.controller";
import { verifyJWT } from "../middlewares/auth.middelware";

const router = Router()

router.route("/check-course-name").get( verifyJWT,CheckExistingCourseByUser)
router.route("/create-course").post( verifyJWT ,createCourse)

export default router