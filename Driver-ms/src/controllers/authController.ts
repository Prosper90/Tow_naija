import { NextFunction, Request, Response } from "express";
import { DriverI } from "../utils/interface";
import DriverService from "../services/driverService";
import ErrorResponse from "../utils/errorResponse";
import bcrypt from "bcrypt";
import DriverRepository from "../repositories/driverRepository";
import { eventService } from "../services/eventService";
import { cloudinaryService } from "../services/cloudinaryService";
import { isValidNigerianPhone } from "../utils/constants";

DriverService.setRepository(new DriverRepository());

class AuthController {

  static SendOtp = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> => {
    try {
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };
      const { 
        //driver
              firstName, 
              lastName, 
              email, 
              phone, 
              dob, 
              // avatar,
              mediumOtp
            } = req.body;


        //for dummy test account
        if(email === "testerDriver@gmail.com" || phone === "2348100000000") {
         return res.status(200).json({ status: true, message: "otp sent, verify your account" });
        }


        //check if this user has originally been registered
        const check = await DriverService.checkExisting({
          email: email,
          phone: phone,
        });
      
       let driver;
       let uploadedImages;

       const requiredFields = [
        "firstName", 
        "lastName", 
        "email", 
        "phone", 
        "dob"
      ];

      
      if(mediumOtp === "phone") {
        if(!isValidNigerianPhone(phone)) {
          return next(new ErrorResponse(`invalid phone format`, 401));
        }
      }

      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

      if (!check) {
        //validate required fileds

        for(let field of requiredFields) {
          if(!req.body[field]) {

            return next(new ErrorResponse(`${field} is required`, 401));
          } else if(!emailRegex.test(req.body.email)) {
            return next(new ErrorResponse(`Invalid email format`, 401));
          }
        
        }

      }


      //Register the driver email or number and get otp
      const exists = check ? true : false;
      
      if(exists && mediumOtp === "email") {
        if(check.email !== email) {
         return next(new ErrorResponse("This user has an account with same number different email", 401));
        }
     }

     if(exists && mediumOtp === "phone") {
       if(check.phone !== phone) {
        return next(new ErrorResponse("This user has an an account with same email different number", 401));
       }
     }  

      if(!exists) {

        //if it doesnt exist, create driver account
        driver = await DriverService.createDriver({
          firstName: firstName,
          lastName: lastName,
          email: email,
          phone: phone,
          dob: new Date(dob),
        });

        if(files) {
          
          // Upload all images to Cloudinary
          uploadedImages = await cloudinaryService.uploadMultipleDriverImages(
            driver._id,
            files
          );

          //update the driver avatar
          await DriverService.updateProfile(driver._id, {avatar: uploadedImages.avatar.url});

        }


      }   
      
      const pickedData =  mediumOtp === "phone" ? phone : email
      const driverOtp = await DriverService.makeOtp(mediumOtp, pickedData);

      //Send the otp to the messaging-ms and the meduim email or number
      await eventService.emitEvent("send_otp", {
        otp: String(driverOtp.otp),
        medium: mediumOtp === "phone" ? phone : email,
        mediumType: `${mediumOtp === "phone" ? 'sms' : 'email'}`,
        user: !exists ? firstName : null
      });

      res
        .status(200)
        .json({ status: true, message: "otp sent, verify your account" });
    } catch (error) {
      next(error);
    } 
  };

  static VerifyOtp = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> => {
    try {
      const { otp } = req.body;

      const { findDriverByOtp, token } = await DriverService.verifyOtp(otp);

      res
        .status(200)
        .json({
          status: true,
          message: "otp verified",
          data: findDriverByOtp,
          ...(token && { token }),
        });
    } catch (error) {
      next(error);
    }
  };

}

export default AuthController;
