import { NextFunction, Request, Response } from "express";
import { RiderI } from "../utils/interface";
import ErrorResponse from "../utils/errorResponse";
import RiderRepository from "../repositories/riderRepository";
import RiderService from "../services/riderService";
import EventService from "../services/eventService";
import JWT from "../utils/jwt";
import { OAuth2Client } from 'google-auth-library';
import { isValidNigerianPhone } from "../utils/constants";


RiderService.setRepository(new RiderRepository());
//initiate a msg_ms object
const msg_ms = new EventService();
//initiate jwt
const jwt = new JWT();
//initiate google client
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);


class AuthController {

  static SendOtp = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> => {
    try {
      const { firstName, lastName, email, phone, mediumOtp } = req.body;

      //for dummy test account
      if(email === "testerRider@gmail.com" || phone === "+2348122222222") {
        return res.status(200).json({ status: true, message: "otp sent, verify your account" });
        }
       

      if(mediumOtp === "phone" && !isValidNigerianPhone(phone)) {
        return next(new ErrorResponse(`invalid phone format`, 401));
      }

      //check if this user has originally been registered
      const check = await RiderService.checkExisting({
        email: email,
        phone: phone,
      });
      

      if (!phone && !email) {
        return next(new ErrorResponse("phone and email required", 401));
      }
      // const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;


      //Register the rider email or number and get otp
      const exists = check ? true : false;
      const param = mediumOtp === "phone" ? phone : email;

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

      
      const riderOtp = await RiderService.makeOtp(param, exists);

      if(!exists) {
        await RiderService.completeRegistration(riderOtp._id as string, {
          firstName: firstName,
          lastName: lastName,
          email: email,
          phone: phone
        })
      }
      


      //Send the otp to the messaging-ms and the meduim email or number
      await msg_ms.emitEvent("send_otp", {
        otp: String(riderOtp.otp),
        medium: mediumOtp === "phone" ? phone : email,
        mediumType: mediumOtp === "phone" ? 'sms' : 'email',
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

      const { findDriverByOtp, token } = await RiderService.verifyOtp(otp);

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


  static SignUpGoogle = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> => {
    try {
      const { idToken } = req.body; // Assuming the frontend sends the Google ID token
      if (!idToken) {
        return res.status(400).json({ status: false, message: 'ID token is required.' });
      }
  
      // Verify Google ID token
      const ticket = await googleClient.verifyIdToken({
        idToken,
        audience: process.env.GOOGLE_CLIENT_ID, // Ensure it matches your Google client ID
      });
  
      const payload = ticket.getPayload();
      if (!payload) {
        return res.status(401).json({ status: false, message: 'Invalid Google ID token.' });
      }
  
      const { email, given_name: firstName, family_name: lastName, sub: googleId } = payload;
  
      // Check if the user already exists in the database
      const existingUser = await RiderService.findUserByGoogleId(googleId);
      if (existingUser) {
        return res.status(200).json({
          status: true,
          message: 'User already registered.',
          data: existingUser,
        });
      }
  
      // Complete registration for new users
      const signUp = await RiderService.completeRegistration(null, {
        firstName,
        lastName,
        email,
        phone: req.body.phone || null, // Phone is optional
        googleId,
      });
  
      res.status(201).json({ status: true, data: signUp });
    } catch (error) {
      next(error);
    }
  };

}

export default AuthController;
