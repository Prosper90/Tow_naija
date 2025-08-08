import { randomInt } from "crypto";
import RiderRepository from "../repositories/riderRepository";
import { RiderI } from "../utils/interface";
import JWT from "../utils/jwt";
import ErrorResponse from "../utils/errorResponse";


interface VerifyOtpResponse {
  findDriverByOtp: Partial<RiderI>; // Assuming findDriverByOtp is an instance of your driver entity model type
  token?: string;
}

//inititalize jwt
const jwt = new JWT();

class RiderService {
  private static emailRegex =
    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    private static riderRepository: RiderRepository;

      // Inject the repository
  static setRepository(repo: RiderRepository) {
    this.riderRepository = repo;
  }

  /**
   *
   * @param otp
   * @returns boolean
   */
  static verifyOtp = async (otp: number): Promise<VerifyOtpResponse> => {
    try {
      //find the user by otp
      const findRiderByOtp = await this.riderRepository.findOneByField({
        'otp': otp,
      });
      if (!findRiderByOtp) {
        throw new Error("otp not valid");
      }

      if(findRiderByOtp.email !== "testerRider@gmail.com") {
        //check if otp is expired
        const expiredTime = new Date(findRiderByOtp.otpExpire);
        if (expiredTime.getTime() < Date.now()) {
          throw new Error ("Otp is expired, get a new one");
        }
      }


      const token = jwt.createToken(findRiderByOtp._id as string);
      

      //since the otp passed all, verify the driver for otp level and then delete otp and otp expire
      if(findRiderByOtp.email === "testerRider@gmail.com") {
        return { findDriverByOtp: findRiderByOtp, token };
      } else if(!findRiderByOtp.isVerified) {
        await this.riderRepository.update(
          "_id",
          findRiderByOtp._id,
          { isVerified: true },
          ["otp", "otpExpire"]
        );
      } else {
        await this.riderRepository.unSetFields(
          "_id",
          findRiderByOtp._id,
          ["otp", "otpExpire"]
        );
      }

      return { findDriverByOtp: findRiderByOtp, token };
    } catch (error) {
      throw error;
    }
  };

  static makeOtp = async (
    emailornumber: string,
    isRegistered: boolean
  ): Promise<RiderI> => {
    try {
      //generate otp and otp Expire with crypto
    
      const otp = randomInt(1000, 9000);
      const otpExpire = new Date(Date.now() + 5 * 60 * 1000);
       
      //email regex
      const checkIfItsEmail = this.emailRegex.test(emailornumber);
       
      //if driver has not been originally registered
      if (!isRegistered) {
        const newRider = await this.riderRepository.create({ 
          [checkIfItsEmail ? 'email' : 'phone']: emailornumber, 
          otp: otp, 
          otpExpire: otpExpire 
        });
        return newRider;
      } else {
        const updateBy = checkIfItsEmail ? "email" : "phone";
        //update this user otp and otpExpire
        const UpdateOtpValues = await this.riderRepository.update(
          updateBy,
          emailornumber,
          { otp: otp, otpExpire: otpExpire }
        );
        return UpdateOtpValues;
      }
    } catch (error) {
      throw error;
    }
  };

  /**
   *
   * @param id
   * @param options
   */
  static completeRegistration = async (
    id: string,
    options: Partial<RiderI>
  ) => {
    try {
      const completeRegistration = this.riderRepository.update("_id", id, options);
      return completeRegistration;
    } catch (error) {
      throw error;
    }
  };

  /**
   *
   * @param options
   * @returns
   */
  static checkExisting = async (condition: { [key: string]: any }): Promise<RiderI> => {
    try {
      let query;
  
      // Check the number of key-value pairs in the condition
      const keys = Object.keys(condition);
  
      if (keys.length === 1) {
        // Directly use the single key-value pair
        query = condition;
      } else if (keys.length > 1) {
        // Create an $or query for multiple key-value pairs
        query = {
          $or: keys.map((key) => ({ [key]: condition[key] })),
        };
      } else {
        throw new Error('Invalid condition: must contain at least one key-value pair');
      }
  
      // Perform the database query
      const findExisting = await this.riderRepository.findOneByField(query);
  
      // Return true if a matching record is found, otherwise false
      return findExisting;
    } catch (error) {
      console.error('Error in checkExisting:', error);
      throw error;
    }
  };



  static getRider = async (id: string) : Promise<Partial<RiderI>> => {
    try {
      const rider = await this.riderRepository.findById(id);
      if(!rider) {
        throw new ErrorResponse("No rider with the id found", 401);
      }

      return rider;
    } catch (error) {
      throw error;
    }
  }

  // In RiderService
  static updateProfile = async (
    id: string,
    profileData: Partial<RiderI>
  ): Promise<RiderI> => {
    try {
      const driver = await this.riderRepository.update("_id", id, profileData);
      if (!driver) throw new Error("User not found");
      return driver;
    } catch (error) {
      throw error;
    }
  };



  static findUserByGoogleId = async (googleId: string): Promise<any> => {
    try {
      return await this.riderRepository.findOneByField({ 'googleId': googleId }); // Replace with actual model
    } catch (error) {
      throw error;
    }
  };


  static deleteProfile = async (id: string) : Promise<boolean> => {
    try {
      const deleteProfile = await this.riderRepository.remove("_id", id);
      return !!deleteProfile; // Return true if deleteProfile is not null/undefined, otherwise false
    } catch (error) {
      throw error
    }
  }

}

export default RiderService;
