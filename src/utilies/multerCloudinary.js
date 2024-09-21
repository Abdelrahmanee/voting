// multerCloudinary.js
import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from './cloudinary.config.js'
// Set up Cloudinary storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'uploads', // Specify the folder in your Cloudinary account
    allowedFormats: ['jpg', 'jpeg', 'png'],
    public_id: (req, file) => `${file.originalname.split('.')[0]}-${Date.now()}`, // Customize file name
  },
});

// Initialize multer with the Cloudinary storage
const upload = multer({ storage });
export default upload;
