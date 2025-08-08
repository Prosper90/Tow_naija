import { randomInt } from "crypto";
import DriverRepository from "../repositories/driverRepository";
import { DriverI } from "../utils/interface";
import bcrypt from "bcrypt";
import JWT from "../utils/jwt";
import axios from "axios";
import config from "../config";
import TransactionRepository from "../repositories/transactionRepository";
import ErrorResponse from "../utils/errorResponse";


const transactionRepository = new TransactionRepository();

interface VerifyOtpResponse {
  findDriverByOtp: Partial<DriverI>; // Assuming findDriverByOtp is an instance of your driver entity model type
  token?: string;
}

class DriverService {
  private static emailRegex =
    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    private static driverRepository: DriverRepository;

      // Inject the repository
  static setRepository(repo: DriverRepository) {
    this.driverRepository = repo;
  }

  /**
   *
   * @param otp
   * @returns boolean
   */
  static verifyOtp = async (otp: number): Promise<VerifyOtpResponse> => {
    try {
      //find the user by otp
      const findDriverByOtp = await this.driverRepository.findOneByFieldAndPopulate({
        'otp': otp,
      }, ["documents", "vehicle"]);

      if (!findDriverByOtp) {
        throw new Error("otp not valid");
      }

      if(findDriverByOtp.email !== "testerDriver@gmail.com") {
          //check if otp is expired
          const expiredTime = new Date(findDriverByOtp.otpExpire);
          if (expiredTime.getTime() < Date.now()) {
            throw new Error("Otp is expired, get a new one");
          }
      }
  

      let token;
  
      const jwt = new JWT();
      token = await jwt.createToken(findDriverByOtp._id as string);
      
      if(findDriverByOtp.email === "testerDriver@gmail.com") {
        return { findDriverByOtp, token };
      } else if(!findDriverByOtp.isVerified) {
        await this.driverRepository.update(
          "_id",
          findDriverByOtp._id,
          { isVerified: true },
          ["otp", "otpExpire"]
        );
      } else {
        await this.driverRepository.unSetFields(
          "_id",
          findDriverByOtp._id,
          ["otp", "otpExpire"]
        );
      }

      return { findDriverByOtp, token };
    } catch (error) {
      throw error;
    }
  };

  static makeOtp = async (
    mediumOtp: string,
    emailornumber: string,
  ): Promise<DriverI> => {
    try {
      //generate otp and otp Expire with crypto
      const otp = randomInt(1000, 9000);
      const otpExpire = new Date(Date.now() + 5 * 60 * 1000);

        //update this user otp and otpExpire
        const UpdateOtpValues = await this.driverRepository.update(
          mediumOtp,
          emailornumber,
          { otp: otp, otpExpire: otpExpire }
        );

        return UpdateOtpValues;
      
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
    options: Partial<DriverI>
  ) => {
    try {
      const completeRegistration = await this.driverRepository.update("_id", id, options);
      return completeRegistration;
    } catch (error) {
      throw error;
    }
  };

  static createDriver = async (
    options: Partial<DriverI>
  ) => {
    try {
      const createAdriver = await this.driverRepository.create(options);
      return createAdriver;
    } catch (error) {
      throw error;
    }
  };

  /**
   *
   * @param options
   * @returns
   */
  static checkExisting = async (condition: { [key: string]: any }): Promise<Partial<DriverI>> => {
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
      const findExisting = await this.driverRepository.findOneByField(query);
  
      // Return true if a matching record is found, otherwise false
      return findExisting;
    } catch (error) {
      console.error('Error in checkExisting:', error);
      throw error;
    }
  };
  /**
   *
   * @param id
   */
  static activateBeingOnline = async (id: string): Promise<boolean | void> => {
    try {
      const driver = await this.driverRepository.findById(id);
      if (!driver) {
        throw new ErrorResponse("User doesnt exist", 404);
      }

      if (!driver.isApproved) {
        throw new ErrorResponse("User account is under review", 403);
      }

      //update isOnline value
     const updatedStat = await this.driverRepository.update("_id", id, {
        isOnline: driver.isOnline ? false : true,
      });

      return updatedStat.isOnline ? true : false;
    } catch (error) {
      throw error;
    }
  };

  // In DriverService
  static updateProfile = async (
    id: string,
    profileData: Partial<DriverI>
  ): Promise<DriverI> => {
    try {
      console.log("We don reach here", profileData);
      
      const driver = await this.driverRepository.update("_id", id, profileData);
      if (!driver) throw new Error("User not found");
      return driver;
    } catch (error) {
      throw error;
    }
  };

    // In DriverService
    static withdraw = async (
      id: string,
      amount: number,
      name: string,
      account_number: string,
      bank_code: string
    ): Promise<any> => {
      try {
        // Fetch driver's details
        const driver = await this.driverRepository.findById(id);
        
        if (!driver) throw new Error("Driver not found");
  
        if (driver.balance < amount) {
          throw new Error("Insufficient balance");
        }
        //initialize transaction
        const paystackInitialize = await axios.post(
          `${config.PAYSTACK_BASE_URL}/transferrecipient`,
          {
            type: "nuban",
            name: name,
            account_number: account_number, 
            bank_code: bank_code,
            currency: "NGN"
          },
          {
            headers: {
              Authorization: `Bearer ${config.PAYSTACK_SECRET}`,
            },
          }
        );
         console.log(paystackInitialize.data.data.recipient_code, "checking out initialization");
         
        if(!paystackInitialize.data.status) {
          throw new Error(paystackInitialize.data.message)
        }

        // Call Paystack API to process payout
        const paystackResponse = await axios.post(
          `${config.PAYSTACK_BASE_URL}/transfer`,
          {
            source: "balance",
            amount: amount * 100, // Convert to kobo
            recipient: paystackInitialize.data.data.recipient_code, 
            reason: "Driver withdrawal",
          },
          {
            headers: {
              Authorization: `Bearer ${config.PAYSTACK_SECRET}`,
            },
          }
        );
        console.log(paystackResponse, "lightning");

        // const paystackResponse ={
        //   data: {
        //     status: true,
        //     data: {
        //       reference: "jjsksk"
        //     }
        //   }
        // }
        
        if (paystackResponse.data.status) {
          // create a transaction
          const newTransaction = await transactionRepository.create({
            driverId: id,
            tx_type: "withdrawal",
            amount: amount,
            status: "pending",
            ref_id: paystackResponse.data.data.reference,
          })
  
        // Deduct amount from driver's balance
        await this.driverRepository.decrement(id, amount);

          return {tx: newTransaction, paystackResponse: paystackResponse.data.data};
        } else {
          throw new Error("Paystack transfer failed");
        }
      } catch (error) {
        throw error;
      }
    };


    // In DriverService
  static deposit = async (
    id: string,
    email: string,
    amount: number
  ): Promise<any> => {
    try {
      // Call Paystack API to initiate payment
      const paystackResponse = await axios.post(
        `${config.PAYSTACK_BASE_URL}/transaction/initialize`,
        {
          email: email, // Replace with actual driver email from DB
          amount: amount * 100, // Paystack uses kobo, so amount is multiplied by 100
          callback_url: "http://13.49.230.10/driver-ms/api/driver/handlepay_callback",
        },
        {
          headers: {
            Authorization: `Bearer ${config.PAYSTACK_SECRET}`,
          },
        }
      );

      if (paystackResponse.data.status) {
        // create a transaction
         const new_transaction = await transactionRepository.create({
          driverId: id,
          amount: amount,
          tx_type: "deposit",
          status: "pending",
          ref_id: paystackResponse.data.data.reference,
         })

        return {tx: new_transaction, paystackResponse: paystackResponse.data.data};
      } else {
        throw new Error("Paystack transaction initialization failed");
      }
    } catch (error) {
      throw error;
    }
  };


  static handlePaystackCallback = async ( reference ): Promise<boolean> => {
    try {
       // Verify transaction with Paystack
       const verifyResponse = await axios.get(
        `${config.PAYSTACK_BASE_URL}/transaction/verify/${reference}`,
        {
          headers: {
            Authorization: `Bearer ${config.PAYSTACK_SECRET}`,
          },
        }
      );

      if (verifyResponse.data.status && verifyResponse.data.data.status === "success") {
        const transaction = await transactionRepository.findOneByField({"ref_id": verifyResponse.data.data.reference});
        if (!transaction) throw new Error("Transaction not found");

        if (transaction.tx_type === "deposit") {
          await this.driverRepository.increment(
            transaction.driverId as string,
            verifyResponse.data.data.amount / 100
          );
        }        

        transaction.status = "success";
        await transaction.save();
  
        return true;
      } else {
        return false;
      }
    } catch (error) {
      throw error
    }
  };



  static deleteProfile = async (id: string) : Promise<boolean> => {
    try {
      const deleteProfile = await this.driverRepository.remove("_id", id);
      return !!deleteProfile; // Return true if deleteProfile is not null/undefined, otherwise false
    } catch (error) {
      throw error
    }
  }  



}

export default DriverService;
