import {
  MainCategory,
  SubCategory,
  categoryMapping,
} from "../constants/CategoryEnum";
import prisma from "../constants/prisma";
import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/asyncHandler";
import { Request, Response } from "express";
import { uploadOnCloudinary } from "../utils/cloudinary";

const createCourse = asyncHandler(async (req: Request, res: Response) => {
  const user = req.user;
  if (!user) {
    return res.status(401).json({
      success: false,
      message: "Not Authenticated",
    });
  }
  try {
    const {
      title,
      description,
      mainCategory,
      subCategory,
    }: {
      title: string;
      description?: string;
      mainCategory: MainCategory;
      subCategory: SubCategory;
    } = req.body;

    console.log(req.body);

    if (title.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const socketRoomName = `${user.id}_${title}`; // we already check that we get only unique name by user from user courses

    // Validate main category and subcategory
    if (!(mainCategory in MainCategory)) {
      return res.status(400).json({
        success: false,
        message: "Invalid main category",
      });
    }

    if (!(subCategory in SubCategory)) {
      return res.status(400).json({
        success: false,
        message: "Invalid subcategory",
      });
    }

    // Validate subcategory against main category
    if (!categoryMapping[mainCategory].includes(subCategory)) {
      return res.status(400).json({
        success: false,
        message: "Subcategory does not match main category",
      });
    }

    console.log("image ka pehla");

    const courseImageLocalPath = req.file?.path;
    if (!courseImageLocalPath) {
      throw new ApiError(400, "CourseImage in local path missing");
    }
    console.log("image ka baad");

    const courseImage = await uploadOnCloudinary(courseImageLocalPath);

    if (!courseImage?.url) {
      throw new ApiError(500, "Error while uploading image on cloudinary");
    }
    console.log("abhi create hoga");

    // creates course
    await prisma.course.create({
      data: {
        name: title,
        description,
        socketRoomName,
        Instructor: {
          connect: {
            id: user.id,
          },
        },
        MainCategory: mainCategory as MainCategory,
        SubCategory: subCategory as SubCategory,
        courseImage: courseImage?.url,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Course Created Successfully",
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "error while creating course",
    });
  }
});

const CheckExistingCourseByUser = asyncHandler(
  async (req: Request, res: Response) => {
    const user = req.user;
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Not Authenticated",
      });
    }
    try {
      const { name } = req.query;
      if (!name) {
        res.status(400).json({
          success: false,
          message: "All fields are required",
        });
      }
      const CheckExistingCourseByUser = await prisma.course.findFirst({
        where: {
          AND: [
            {
              name: String(name),
            },
            {
              id: user.id,
            },
          ],
        },
      });
      if (CheckExistingCourseByUser) {
        return res.status(400).json({
          success: false,
          message: "User Already created course with this name",
        });
      } else {
        return res.status(200).json({
          success: true,
          message: "Course name is Unique",
        });
      }
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "error while checking course name",
      });
    }
  }
);

const getUserCourses = asyncHandler(async (req: Request, res: Response) => {
  const user = req.user;
  if (!user) {
    throw new ApiError(401, "Not Authenticated");
  }
  try {
    const courses = await prisma.course.findMany({
      where: {
        InstructorID: user.id,
      },
      select: {
        courseImage: true,
        description: true,
        createdAt: true,
        id: true,
        Instructor: {
          select: {
            avatar: true,
            createdAt: true,
            email: true,
            id: true,
            isVerified: true,
            name: true,
          },
        },
        MainCategory: true,
        name: true,
        socketRoomName: true,
        SubCategory: true,
      },
    });

    return res.status(200).json({
      success : true ,
      message : "User uploaded Courses fetched" ,
      courses : courses ?  courses : {}
    })
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success : false ,
      message : "error while fetching user courses"
    })
  }
});

export { CheckExistingCourseByUser, createCourse , getUserCourses };
