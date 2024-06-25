import multer, { Multer, StorageEngine } from "multer";
import { Request } from "express";
import path from "path";
import * as fs from 'fs';

// Define a custom storage engine that implements StorageEngine interface
const storageEngine: StorageEngine = {
  _handleFile: function (req: Request, file: Express.Multer.File, cb: (error: Error | null, info: { path: string }) => void) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, {
      path: './public/temp/' + uniqueSuffix + path.extname(file.originalname)
    });
  },
  _removeFile: function (req: Request, file: Express.Multer.File, cb: (error: Error | null) => void) {
    // Implement file removal logic if needed
    const filePath = './public/temp/' + file.filename;
    fs.unlink(filePath, (err) => {
      if (err) {
        cb(err);
      } else {
        cb(null);
      }
    });
  }
};

// Configure multer with custom storage engine
const storage: multer.StorageEngine = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/temp');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
    
  }
  
});

// Initialize multer with custom storage engine
const upload: Multer = multer({
  storage: storage
});

export { upload };
