import { Router } from "express";
import { CheckExistingCourseByUser, createCourse } from "../contollers/course.controller";

const router = Router()

router.route("/check-course-name").get(CheckExistingCourseByUser)
router.route("/create-course").post(createCourse)

export default router