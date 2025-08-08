import { NextFunction, Request, Response } from "express";
import { RiderI } from "../utils/interface";
import ErrorResponse from "../utils/errorResponse";
import RiderRepository from "../repositories/riderRepository";
import RiderService from "../services/riderService";
import EventService from "../services/eventService";
import JWT from "../utils/jwt";
import { cloudinaryService } from "../services/cloudinaryService";
import { isValidNigerianPhone } from "../utils/constants";

RiderService.setRepository(new RiderRepository());
//initiate a msg_ms object
const msg_ms = new EventService();
//initiate jwt
const jwt = new JWT();

class RiderController {

  static getRiderDetails = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> => {
    try {
      const { id } = req.params;

      //check if this user has originally been registered
      const check = await RiderService.getRider(id);

      res
        .status(200)
        .json({ status: true, data: check });
    } catch (error) {
      next(error);
    }
  };

  static UpdateProfile = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<RiderI | any> => {
    try {
      // const file = req.files?.[0] as Express.Multer.File;
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };
      const avatarFile = files?.avatar?.[0];
      
      // const profileData : Partial<RiderI> = req.body;
      const { firstName, lastName, email, phone } = req.body;

      if(phone && !isValidNigerianPhone(phone)) {
        return next(new ErrorResponse(`invalid phone format`, 401));
      }

      let uploadedImages;
      console.log("files in checkingsss");
      
      if (avatarFile) {
        
        if (req.user?.avatar) {
          // Delete existing avatar if present
          await cloudinaryService.deleteRiderImage(req.user._id);
        }

        // Upload the new avatar
        uploadedImages = await cloudinaryService.uploadRiderImage(
          avatarFile,
          req.user._id,
          'avatar'
        );
        
      }

    // Construct updated profile data dynamically
    const updatedProfileData: Partial<RiderI> = {
      ...(firstName && { firstName }),
      ...(lastName && { lastName }),
      ...(email && { email }),
      ...(phone && { phone }),
      ...(uploadedImages && { 'avatar': uploadedImages.url }),
    };
      // const updatedProfileData = {
      //   ...profileData,
      //   ...(uploadedImages ? { avatar: uploadedImages.url } : {}),
      // };
      

      const driver = await RiderService.updateProfile(req.user._id, updatedProfileData);

      res.status(200).json({
        status: true,
        message: "Profile updated successfully",
        data: driver,
      });
    } catch (error) {
      next(error);
    }
  };

  static SignUp = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> => {
    try {
      const { firstName, lastName, email, phone } = req.body;

      const getExistingRider = await RiderService.checkExisting({phone: phone});
      if(!getExistingRider) {
        throw "Rider doesn't exists"
      }

      //hash the password
      const signUp = await RiderService.completeRegistration(getExistingRider._id as string, {
        firstName: firstName,
        lastName: lastName,
        email: email,
        phone: phone
      });

     const token = await jwt.createToken(signUp._id as string);

      res.status(200).json({ status: true, data: signUp, token: token });
    } catch (error) {
      next(error);
    }
  };


  static SignUpGoogle = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> => {
    try {
      const { firstName, lastName, email, phone } = req.body;

      //hash the password
      const signUp = await RiderService.completeRegistration(req.user._id, {
        firstName: firstName,
        lastName: lastName,
        email: email,
        phone: phone
      });

      res.status(200).json({ status: true, data: signUp });
    } catch (error) {
      next(error);
    }
  };


  static DeleteProfile = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) : Promise<any> => {
    try {
      const {email, phone} = req.body;
      //check if this user has originally been registered
      const check = await RiderService.checkExisting({
        email: email,
        phone: phone,
      });
      

      if (!phone && !email) {
        return next(new ErrorResponse("phone and email required", 401));
      }



      await RiderService.deleteProfile(check._id as string);
      res.status(200).json({ message: "Profile deleted successfully" });
    } catch (error) {
      next(error);
    }
  }

    static HasAccount = async (
      req: Request,
      res: Response,
      next: NextFunction
    ) : Promise<any> => {
      try {
        const {emailorphone} = req.params;
        //check if this user has originally been registered
        const check = await RiderService.checkExisting({
          email: emailorphone,
          phone: emailorphone,
        });
        
  
        if (!emailorphone) {
          return next(new ErrorResponse("phone or email required", 401));
        }
  
        if(!check) {
          return res.status(200).json({ status: true, data: false });
        }
  
        return res.status(200).json({ status: true, data: true });
      } catch (error) {
        next(error);
      }
    }

}

export default RiderController;
