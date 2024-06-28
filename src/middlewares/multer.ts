import multer, { Multer } from "multer";
import path from "path";
import * as fs from 'fs';

// Ensure the upload directory exists
const videoUploadDir = './public/videos';
if (!fs.existsSync(videoUploadDir)) {
  fs.mkdirSync(videoUploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, videoUploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

// Initialize multer with custom storage engine and file filter for videos and thumbnails
const uploadVideoBoth: Multer = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    const videoFileTypes = /mp4|mkv|avi|mov/;
    const imageFileTypes = /jpeg|jpg|png/;
    const extname = videoFileTypes.test(path.extname(file.originalname).toLowerCase()) || imageFileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimeType = videoFileTypes.test(file.mimetype) || imageFileTypes.test(file.mimetype);

    if (extname && mimeType) {
      return cb(null, true);
    } else {
      cb(new Error('Only video and image files are allowed!'));
    }
  },
  limits: { fileSize: 1024 * 1024 * 500 } // Limit file size to 500MB
});

export { uploadVideoBoth };
