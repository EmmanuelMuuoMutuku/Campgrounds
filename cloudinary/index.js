//Import the Cloudinary library (version 2) for managing media uploads
const cloudinary = require('cloudinary').v2;

// Import CloudinaryStorage class from multer-storage-cloudinary
// Used to configure how files are stored in Cloudinary
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Configure Cloudinary with credentials stored in the environment variables
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, // Cloudinary account's cloud name
    api_key: process.env.CLOUDINARY_KEY,           // API key for authentication
    api_secret: process.env.CLOUDINARY_SECRET      // Secret key for secure API access
});


// Set up CloudinaryStorage to define how files are stored in Cloudinary
const storage = new CloudinaryStorage({
    cloudinary, // Reference to the configured Cloudinary instance
    params: {
        folder: 'YelpCamp', // Folder name in Cloudinary to store files
        allowedFormats: ['jpeg', 'png', 'jpg'] // Restrict file formats 
    }
});


// Export both the configured Cloudinary instance and storage object
module.exports = {
    cloudinary, // Allow other modules to directly interact with Cloudinary
    storage     // Provides the storage configuration for file uploads
};