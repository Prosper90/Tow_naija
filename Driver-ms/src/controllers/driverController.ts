import { NextFunction, Request, Response } from "express";
import { DriverI } from "../utils/interface";
import DriverService from "../services/driverService";
import DriverRepository from "../repositories/driverRepository";
import config from "../config";
import axios from "axios";
import { cloudinaryService } from "../services/cloudinaryService";
import { isValidNigerianPhone } from "../utils/constants";
import ErrorResponse from "../utils/errorResponse";

DriverService.setRepository(new DriverRepository());

class DriverController {

  static GetDriver = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> => {
    try {
      const driverProfile = await DriverService.checkExisting({_id: req.user._id});
      res.status(200).json({
        status: true,
        data: driverProfile,
      });
    } catch (error) {
      next(error);
    }
  };

  static NotifyOnlineStatus = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> => {
    try {
      const activateOnline = await DriverService.activateBeingOnline(req.user._id);
      res.status(200).json({
        status: true,
        message: activateOnline ? "Activated" : "Deactivated",
      });
    } catch (error) {
      next(error);
    }
  };

  static UpdateProfile = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<DriverI | any> => {
    try {
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };

      const avatarFile = files?.avatar?.[0];      
      
      const { firstName, lastName, email, dob, state, lga, passCode, phone } = req.body;

      let uploadedImages;

      if(phone && !isValidNigerianPhone(phone)) {
        return next(new ErrorResponse(`invalid phone format`, 401));
      }

      if (avatarFile) {
        
        if (req.user?.avatar) {
          // Delete existing avatar if present
          await cloudinaryService.deleteDriverImage(req.user._id);
        }

        // Upload the new avatar
        uploadedImages = await cloudinaryService.uploadDriverImage(
          avatarFile,
          req.user._id,
          'avatar'
        );

        
      }


    //  const profileData = {
    //     firstName: firstName,
    //     lastName: lastName,
    //     email: email,
    //     phone: phone,
    //     dob: dob,
    //     state: state,
    //     lga: lga,
    //     avatar: avatar,
    //     passCode: passCode
    //   }

      const updatedProfileData : Partial<DriverI> = {
        ...(firstName && { firstName }),
        ...(lastName && { lastName }),
        ...(email && { email }),
        ...(phone && { phone }),
        ...(dob && { dob }),
        ...(state && { state }),
        ...(lga && { lga }),
        ...(passCode && { passCode }),
        ...(uploadedImages ? { 'avatar': uploadedImages.url } : {}),
      };
      

      const driver = await DriverService.updateProfile(
        req.user._id,
        updatedProfileData
      );
      
      res.status(200).json({
        status: true,
        message: "Profile updated successfully",
        data: driver,
      });

    } catch (error) {
      next(error);
    }
  };


  static CreatePasscode = async (    
    req: Request,
    res: Response,
    next: NextFunction
  ) : Promise<any> => {
      try {
        const { passCode } = req.body;
        
        const driver = await DriverService.updateProfile(
          req.user._id,
          {passCode: passCode}
        );

        res.status(200).json({
          status: true,
          message: "Passcode created",
          data: driver
        });
      } catch (error) {
        next(error);
      }
  }

  static Deposit = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> => {
    try {
      const { amount } = req.body;
      const {tx, paystackResponse} = await DriverService.deposit(req.user._id, req.user.email, amount);
      res.status(200).json({ status: true, data: {tx, paystackResponse} });
    } catch (error) {
      next(error);
    }
  };

  static Withdrawal = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> => {
    try {
      const {amount, name, account_number, bank_code} = req.body;
      const {tx, paystackResponse} = await DriverService.withdraw(req.user._id, amount, name, account_number, bank_code);
      res.status(200).json({ status: true, data: {tx, paystackResponse} });
    } catch (error) {
      next(error);
    }
  };

  static VerifyAccountNumber = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { account_number, bank_code } = req.body;
      const options = {
        method: 'GET',
        url: `${config.PAYSTACK_BASE_URL}/bank/resolve`,
        params: {
          account_number: account_number,
          bank_code: bank_code
        },
        headers: {
          Authorization: `Bearer ${config.PAYSTACK_SECRET}`
        }
      };

     const result = await axios(options);
      res.status(200).json({ status: true, data: result.data.data });
    } catch (error) {
      next(error);
    }
  }; 


  static GetBanks = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const options = {
        method: 'GET',
        url: `${config.PAYSTACK_BASE_URL}/bank`,
        headers: {
          Authorization: `Bearer ${config.PAYSTACK_SECRET}`
        }
      };

     const result = await axios(options);
      res.status(200).json({ status: true, data: result.data.data });
    } catch (error) {
      next(error);
    }
  }; 


  static handlePaystackCallback = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { reference } = req.query;
      
      const isSuccessful = await DriverService.handlePaystackCallback(reference);
      res.status(200).json({ status: true, data: isSuccessful });
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
      const check = await DriverService.checkExisting({
        email: email,
        phone: phone,
      });
      

      if (!phone && !email) {
        return next(new ErrorResponse("phone and email required", 401));
      }



      await DriverService.deleteProfile(check._id as string);
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
      const { emailorphone } = req.params;
      //check if this user has originally been registered
      const check = await DriverService.checkExisting({
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

export default DriverController;
