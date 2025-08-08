import multer from 'multer';
import path from 'path';
import { Request } from 'express';
import ErrorResponse from '../utils/errorResponse';

// Configure multer for memory storage
const storage = multer.memoryStorage();

// File filter to validate images
const fileFilter = (req: Request, file: Express.Multer.File, cb: any) => {
  const allowedMimes = ['image/jpeg', 'image/png', 'image/jpg'];
  
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new ErrorResponse('Invalid file type. Only JPEG, PNG and JPG allowed.', 400), false);
  }
};

// Configure multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  }
});

// Define fields for multiple file uploads
const uploadFields = upload.fields([
  { name: 'avatar', maxCount: 1 },
  { name: 'driver_lisence_img_front', maxCount: 1 },
  { name: 'driver_lisence_img_back', maxCount: 1 },
  { name: 'car_pic_with_platenumber', maxCount: 1 },
  { name: 'vehicle_reg_image_cert', maxCount: 1 }
]);

export default uploadFields;