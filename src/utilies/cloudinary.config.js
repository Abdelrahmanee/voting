import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,   // Ensure this matches the .env file
  api_key: process.env.API_KEY,         // Ensure the API key is correctly set
  api_secret: process.env.API_SECRET,   // Ensure the API secret is correctly set
});

export default cloudinary;
