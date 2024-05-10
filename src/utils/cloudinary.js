import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;
    // Upload the file on Cloudinary
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });
    // File has been successfully uploaded on Cloudinary
    console.log(
      "File has been successfully uploaded on Cloudinary",
      response.url
    );
    fs.unlinkSync(localFilePath); // Remove the file from local storage
    return response;
  } catch (error) {
    fs.unlinkSync(localFilePath); // Remove the file from local storage
    return null;
  }
};

export { uploadCloudinary };
