import { v2 as cloudinary } from 'cloudinary';
import DatauriParser from 'datauri/parser';
import path from 'path';
import { CloudinaryResponse } from '../utils/interface';
import ErrorResponse from '../utils/errorResponse';

const parser = new DatauriParser();

class CloudinaryService {
  constructor() {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET
    });
  }

  private generatePath(driverId: string, fileName: string): string {
    return `TowNiaja/Riders/${driverId}/${fileName}`;
  }

  private bufferToDataURI(file: Express.Multer.File): string {
    const extName = path.extname(file.originalname).toString();
    return parser.format(extName, file.buffer).content;
  }

  async uploadRiderImage(
    file: Express.Multer.File,
    driverId: string,
    imageType: 'avatar'
  ): Promise<CloudinaryResponse> {
    try {
      if (!file) {
        throw new ErrorResponse('No image file provided', 400);
      }

      const fileName = `${imageType}_${Date.now()}`;
      const folderPath = this.generatePath(driverId, fileName);
      const fileContent = this.bufferToDataURI(file);

      const result = await cloudinary.uploader.upload(fileContent, {
        folder: folderPath,
        resource_type: 'auto',
        quality: 'auto',
        fetch_format: 'auto',
      });

      return {
        public_id: result.public_id,
        url: result.secure_url,
        path: folderPath
      };
    } catch (error) {
      throw new ErrorResponse(
        `Error uploading ${imageType} image: ${error.message}`,
        500
      );
    }
  }


  async deleteRiderImage(publicId: string): Promise<boolean> {
    try {
      const result = await cloudinary.uploader.destroy(publicId);
      return result.result === 'ok';
    } catch (error) {
      throw new ErrorResponse(
        `Error deleting image: ${error.message}`,
        500
      );
    }
  }

  async uploadMultipleRiderImages(
    driverId: string,
    files: {
      [fieldname: string]: Express.Multer.File[];
    }
  ): Promise<Record<string, CloudinaryResponse>> {
    const uploads: Record<string, CloudinaryResponse> = {};
    const imageTypeMap = {
      'avatar': 'avatar'
    };

    for (const [fieldName, fileArray] of Object.entries(files)) {
      if (fileArray && fileArray.length > 0) {
        const imageType = imageTypeMap[fieldName];
        uploads[imageType] = await this.uploadRiderImage(
          fileArray[0],
          driverId,
          imageType as any
        );
      }
    }

    return uploads;
  }
}

export const cloudinaryService = new CloudinaryService();