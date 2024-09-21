// uploadMiddleware.js

import { default as upload } from "../utilies/multerCloudinary.js";

// Middleware to upload a single file
const uploadSingle = upload.single('image'); // 'image' is the field name in the form

const uploadPhotoMiddleware = (req, res, next) => {
  uploadSingle(req, res, (err) => {
    if (err) {
      return res.status(400).json({ message: 'Error uploading image', error: err.message });
    }
    // Image uploaded, proceed to the next middleware or route handler
    next();
  });
};

export default uploadPhotoMiddleware;
