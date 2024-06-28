import { Router } from "express";
import { CheckExistingCourseByUser, createCourse, getUserCourses } from "../contollers/course.controller";
import { verifyJWT } from "../middlewares/auth.middelware";
import { upload } from "../middlewares/multer.middleware";
import { body } from "express-validator";

const router = Router()


router.route("/check-course-name").get( verifyJWT,CheckExistingCourseByUser)
router.route("/create-course").post( verifyJWT , upload.single("image") , [
    body("title").notEmpty().withMessage("Title is required"),
    body("mainCategory").notEmpty().withMessage("MainCategory  is required"),
    body("subCategory").notEmpty().withMessage("SubCategory is required"),
    body('description').optional().isString().withMessage('Description must be a string if provided')
  
] , createCourse)
router.route("/get-user-courses").get(verifyJWT , getUserCourses)

export default router