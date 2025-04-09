
const cloudinary = require('cloudinary').v2;

//config with env data

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

//upload function
const uploadMediaToCloudinary = async (filePath) => {
    try {
        const result = await cloudinary.uploader.upload(filePath, {
            resource_type: 'auto',
        })
        return result
    } catch (error) {
        console.log('Error uploading to Cloudinary:', error);
        throw new Error('Cloudinary upload failed');
        
    }
}

const deleteMediaFromCloudinary = async (publicId) => {
    try {
      await cloudinary.uploader.destroy(publicId)  
    } catch (error) {
        console.log('Error deleting from Cloudinary:', error);
        throw new Error('Cloudinary delete failed');
        
    }


}

module.exports = { uploadMediaToCloudinary, deleteMediaFromCloudinary }