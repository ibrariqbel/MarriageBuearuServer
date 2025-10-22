require("dotenv").config();

const cloudinary = require("cloudinary");

 // Configuration
    cloudinary.config({ 
        cloud_name:process.env.CLOUDINARY_NAME, 
        api_key: process.env.CLOUDINARY_API, 
        api_secret:process.env.CLOUDINARY_SECRETKEY, // Click 'View API Keys' above to copy your API secret
    });

    const uploadToCloud = async(imagePath)=>{
        try {
            const upload = await cloudinary.uploader.upload(imagePath,{
                folder:"wedding"
            });

            return upload;
        } catch (error) {
            console.error(error)
        }
    }
    module.exports = {uploadToCloud}