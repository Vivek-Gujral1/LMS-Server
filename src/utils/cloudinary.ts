import { v2 as cloudinary  , UploadApiResponse} from "cloudinary"
import fs from "fs"


cloudinary.config({
    cloud_name : process.env.CLOUDINARY_CLOUDNAME,
    api_key    : process.env.CLOUDINARY_APIKEY ,
    api_secret  : process.env.CLOUDINARY_APISECRET
})

  export const uploadOnCloudinary = async(localfilePath : string) : Promise< UploadApiResponse | null> =>{
    try {
        if (!localfilePath) return null
        // upload file on cloudinary
        const response = await cloudinary.uploader.upload(localfilePath , {
            resource_type : "auto"
        })
        fs.unlinkSync(localfilePath)
        return response
    } catch (error) {
        fs.unlinkSync(localfilePath)
        return null
    }
}