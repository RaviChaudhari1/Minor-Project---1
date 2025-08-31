// utils/cloudinary.js
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;

    // Upload to Cloudinary
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });

    // Delete file from local storage after upload
    fs.unlinkSync(localFilePath);

    return response; // includes secure_url
  } catch (error) {
    fs.unlinkSync(localFilePath); // remove file if error occurs
    console.error("Cloudinary upload error:", error);
    return null;
  }
};

export { uploadOnCloudinary };
