import {
  MainCategory,
  SubCategory,
  categoryMapping,
} from "../constants/CategoryEnum";
import prisma from "../constants/prisma";
import { asyncHandler } from "../utils/asyncHandler";
import { Request, Response } from "express";

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
      name,
      description,
      mainCategory,
      subCategory,
    }: {
      name: string;
      description?: string;
      mainCategory: MainCategory;
      subCategory: SubCategory;
    } = req.body;

    if (name.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const socketRoomName = `${user.id}_${name}`; // we already check that we get only unique name by user from user courses

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

    // creates course

    await prisma.course.create({
      data: {
        name,
        description,
        socketRoomName,
        Instructor: {
          connect: {
            id: user.id,
          },
        },
        MainCategory: mainCategory as MainCategory,
        SubCategory: subCategory as SubCategory,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Course Created Successfully",
    });
  } catch {
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

export { CheckExistingCourseByUser, createCourse };
