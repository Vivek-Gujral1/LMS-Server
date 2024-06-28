import { asyncHandler } from "../utils/asyncHandler";
import { Request, Response } from "express";
import { validationResult } from "express-validator";
import path from "path";
import { uploadOnCloudinary } from "../utils/cloudinary";
import prisma from "../constants/prisma";

const uploadVideo = asyncHandler(async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
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
    
    }: { title: string; description?: string;  } = req.body;

    const { courseID } = req.params;
    console.log(req.params);
    

    if (!req.files) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const files = req.files as { [fieldname: string]: Express.Multer.File[] };

    const videoFile = files["video"]?.[0];
    const thumbnailFile = files["thumbnail"]?.[0];

    if (!videoFile) {
      return res
        .status(400)
        .json({ message: "No video file uploaded", success: false });
    }

    const videoPath = path.join(__dirname, "../../", videoFile.path);
    const thumbnailPath = thumbnailFile
      ? path.join(__dirname, "../../", thumbnailFile.path)
      : undefined;

    const videoUploadResponse = await uploadOnCloudinary(videoPath);
    if (!videoUploadResponse) {
      return res.status(500).json({
        message: "video upload nahi huai",
      });
    }
    const thumbnailUploadResponse = thumbnailPath
      ? await uploadOnCloudinary(thumbnailPath)
      : undefined;

    await prisma.video.create({
      data: {
        title,
        duration: Math.round(videoUploadResponse.duration),
        videoFileURL: videoUploadResponse.secure_url,
        description,
       
        videoOwner: {
          connect: {
            id: user.id,
          },
        },
        videoCourse: {
          connect: {
            id: "667a45293a6e9c661e18ff35",
          },
        },
        thumbnail: thumbnailUploadResponse
          ? thumbnailUploadResponse.secure_url
          : undefined,
      },
    });

    return res.status(200).json({
     success : true ,
      message: "video uploaded Successfully",
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "error while uploading video",
      success: false
    });
  }
});

export { uploadVideo };
