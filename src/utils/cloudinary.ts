import { v2 as cloudinary } from "cloudinary";
import fs from "fs"


cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUDNAME,
    api_key: process.env.CLOUDINARY_APIKEY,
    api_secret: process.env.CLOUDINARY_APISECRET
});

export const uploadOnCloudinary = async (localfilePath: string): Promise<any> => {
    try {
        if (!localfilePath) return null;
        // upload file on cloudinary
        const response = await cloudinary.uploader.upload(localfilePath, {
            resource_type: "video"
        });
        fs.unlinkSync(localfilePath);
        return response;
    } catch (error) {
        fs.unlinkSync(localfilePath);
        throw error;
    }
};


