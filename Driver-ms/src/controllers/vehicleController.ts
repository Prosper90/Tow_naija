import { NextFunction, Request, Response } from "express";
import { VehicleI } from "../utils/interface";
import VehicleService from "../services/vehicleService";
import ErrorResponse from "../utils/errorResponse";
import VehicleRepository from "../repositories/vehicleRepository";
import { cloudinaryService } from "../services/cloudinaryService";


VehicleService.setRepository(new VehicleRepository());

class VehicleController {




  static createVehicle = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<VehicleI | any> => {
    try {

         //check for files
         const files = req.files as { [fieldname: string]: Express.Multer.File[] };

         //vehicle body
         const { type_of, vehicle_brand_name, registration_plate_number, vehicle_production_year, } = req.body;
        
        //check if our user already has a vehicle registered
        const findVehicle = await VehicleService.isVehicle(req.user._id);
        if(findVehicle) {
          return next(new ErrorResponse("Vehicle info already submitted", 401));
        }

        if(!req.user.isVerified) {
          return next(new ErrorResponse("User needs to verify thier account to proceed", 401));
        }

         const requiredFields = [
          "type_of",
          "vehicle_brand_name",
          "registration_plate_number",
          "vehicle_production_year",
        ];
  
        const requiredFiles = [
          "car_pic_with_platenumber",
          "vehicle_reg_image_cert"
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

        //create vehicle
        const vehicle = await VehicleService.submitVehicleInfo(req.user._id, {
              driverId: req.user._id,
              typeOf: type_of,
              plateNumber: registration_plate_number,
              brandName: vehicle_brand_name,
              productionYear: new Date(vehicle_production_year),
              carImageWitPlate: uploadedImages.car_plate.url,
              vehicleRegistrationCertificateImage: uploadedImages.registration_cert.url
        })


      res.status(200).json({ status: true, data: vehicle });
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
  static getVehicleInfo = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<VehicleI | any> => {
    try {
      const getDocument = await VehicleService.getVehicleInfo(req.user._id);
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
  static updateVehicleInfo = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<VehicleI | any> => {
    try {
      const vehicleData = req.body;
      const vehicleUpdated = await VehicleService.updateVehicleInfo(
        req.user._id,
        vehicleData
      );
      res.status(200).json({
        status: true,
        message: "Documents updated successfully",
        data: vehicleUpdated,
      });
    } catch (error) {
      next(error);
    }
  };

  
}

export default VehicleController;
