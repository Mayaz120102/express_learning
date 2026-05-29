import { goruUploadToCloudinary } from "../config/goruCloudinary.js";

export const goruUploadImages = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No images uploaded",
      });
    }

    // Upload all images to Cloudinary in parallel
    const uploadPromises = req.files.map((file) =>
      goruUploadToCloudinary(file.buffer, file.mimetype),
    );

    const urls = await Promise.all(uploadPromises);

    res.status(200).json({
      success: true,
      message: `${urls.length} image(s) uploaded successfully`,
      urls,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
