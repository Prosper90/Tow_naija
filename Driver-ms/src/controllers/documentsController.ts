import { NextFunction, Request, Response } from "express";
import { DocumentI, DriverI, VehicleI } from "../utils/interface";
import DocumentService from "../services/documentService";
import ErrorResponse from "../utils/errorResponse";
import DocumentRepository from "../repositories/documentRepository";
import { cloudinaryService } from "../services/cloudinaryService";

DocumentService.setRepository(new DocumentRepository());


class DocumentsController {


  /**
   * 
   * @param req 
   * @param res 
   * @param next 
   * @returns 
   */
  static createDocument = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<VehicleI | any> => {
    try {

         //check for files
         const files = req.files as { [fieldname: string]: Express.Multer.File[] };

         //vehicle body
         const { driver_lisence, driver_liscence_expiry } = req.body;
        
        //check if our user already has a vehicle registered
        const findDocument = await DocumentService.isDocuments(req.user._id as string);
        if(findDocument) {
          return next(new ErrorResponse("Documents info already submitted", 401));
        }

        if(!req.user.isVerified) {
          return next(new ErrorResponse("User needs to verify thier account to proceed", 401));
        }

         const requiredFields = [
          "driver_lisence",
          "driver_liscence_expiry"
        ];
  
        const requiredFiles = [
          "driver_lisence_img_front",
          "driver_lisence_img_back"
        ];

         for(let field of requiredFields) {
          if(!req.body[field]) {
            return next(new ErrorResponse(`${field} is required`, 401));
          }
        }


        // Validate required files
        for(let field of requiredFiles) {
          if(!files[field] || files[field].length === 0) {
            return next(new ErrorResponse(`${field} image is required`, 401));
          }
        }

        // Upload all images to Cloudinary
        const uploadedImages = await cloudinaryService.uploadMultipleDriverImages(
          req.user._id,
          files
        );
        //create document
        const document = await DocumentService.submitDocument(req.user._id, {
          driverId: req.user._id,
          isApproved: true,
          dl: {
            driverLiscense: driver_lisence,
            driverLiscenceExpiration: new Date(driver_liscence_expiry),
            dl_image_front: uploadedImages.license_front.url,
            dl_image_back: uploadedImages.license_back.url
          }
        })
        
      res.status(200).json({ status: true, data: document });
    } catch (error) {
      next(error);
    }
  };



  /**
   *
   * @param req
   * @param res
   * @param next
   */
  static getDocuments = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<DocumentI | any> => {
    try {
      const getDocument = await DocumentService.getDocuments(req.user._id);
      res.status(200).json({ status: true, data: getDocument });
    } catch (error) {
      next(error);
    }
  };



  /**
   *
   * @param req
   * @param res
   * @param next
   */
  static updateDocuments = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<DocumentI | any> => {
    try {
      const documentData = req.body;
      const docuemnt = await DocumentService.updateDocument(
        req.user._id,
        documentData
      );
      res.status(200).json({
        status: true,
        message: "Documents updated successfully",
        data: docuemnt,
      });
    } catch (error) {
      next(error);
    }
  };
}

export default DocumentsController;
