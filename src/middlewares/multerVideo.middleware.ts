import multer, { Multer, StorageEngine } from "multer";
import { Request } from "express";
import path from "path";
import * as fs from 'fs';


// This multer middleware is for uploading videos

// Ensure the upload directory exists
const videoUploadDir = './public/videos';
if (!fs.existsSync(videoUploadDir)) {
  fs.mkdirSync(videoUploadDir, { recursive: true });
}

// Configure multer with custom storage engine and file filter for videos
const videoStorage: multer.StorageEngine = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, videoUploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

// Initialize multer with custom storage engine and file filter for videos
const uploadVideo: Multer = multer({
  storage: videoStorage,
  fileFilter: function (req, file, cb) {
    const fileTypes = /mp4|mkv|avi|mov/;
    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimeType = fileTypes.test(file.mimetype);

    if (extname && mimeType) {
      return cb(null, true);
    } else {
      cb(new Error('Only video files are allowed!'));
    }
  },
  limits: { fileSize: 1024 * 1024 * 500 } // Limit file size to 500MB
});

export { uploadVideo };
