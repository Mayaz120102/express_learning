import "./goruEnv.js";
import { v2 as cloudinary } from "cloudinary";
import multer from "multer";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Store file in memory as a Buffer — not on disk
// We'll pipe this buffer directly to Cloudinary
const goruStorage = multer.memoryStorage();

// File filter — images only
const goruFileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed"), false);
  }
};

// Multer instance
const goruUpload = multer({
  storage: goruStorage,
  fileFilter: goruFileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});

// Helper function — uploads a single buffer to Cloudinary
// Returns the secure URL
export const goruUploadToCloudinary = (fileBuffer, mimetype) => {
  return new Promise((resolve, reject) => {
    // upload_stream pipes a buffer directly to Cloudinary
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "egoru",
        transformation: [
          {
            width: 800,
            height: 600,
            crop: "limit",
            quality: "auto",
          },
        ],
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result.secure_url);
      },
    );

    // End the stream with our file buffer
    uploadStream.end(fileBuffer);
  });
};

export default goruUpload;
