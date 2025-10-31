require("dotenv").config();

const cloudinary = require("cloudinary").v2;

// Configuration
cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadToCloud = async (imagePath) => {
    try {
        const upload = await cloudinary.uploader.upload(imagePath, {
            folder: "wedding"
        });
        return upload;
    } catch (error) {
        console.error("Cloudinary Upload Error:", error.message);
        throw error;
    }
};

module.exports = { uploadToCloud };
