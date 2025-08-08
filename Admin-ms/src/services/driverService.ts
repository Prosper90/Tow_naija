import { randomInt } from "crypto";
import DriverRepository from "../repositories/driverRepository";
import { DriverI } from "../utils/interface";
import bcrypt from "bcrypt";
import JWT from "../utils/jwt";
import ErrorResponse from "../utils/errorResponse";

// const driverRepository = new DriverRepository();

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



    static getAll = async (): Promise<DriverI[] | null> => {
      try {

        // Check if a review already exists for the driver
        const existingdrivers = await this.driverRepository.findAllByFieldAndPopulate(["documents", "vehicle"]);


        // const findAdmin = await this.adminRepository.findOneByFieldAndPopulate({
        //   'email': otp,
        // }, ["documents", "vehicle"]);

        if (!existingdrivers) {
          throw new Error("No drivers currently.");
        }
  
        // return the reviews
        return existingdrivers;
      } catch (error) {
        throw error;
      }
    };



    static getOne = async (
      driverId: string,
    ): Promise<DriverI | null> => {
      try {
        // Validate the input
        if (!driverId) {
          throw new ErrorResponse("Enter driver id", 409);
        }
  
        // Check if that driver exists
        const existingdriver = await this.driverRepository.findById(driverId as string);
        if (!existingdriver) {
          throw new ErrorResponse("Driver does not exist", 409);
        }
  
        // return the reviews
        return existingdriver;
      } catch (error) {
        throw error;
      }
    };



    static updateDriver = async (
      id: string,
      profileData: Partial<DriverI>
    ): Promise<DriverI> => {
      try {
        
        const driver = await this.driverRepository.update("_id", id, profileData);
        if (!driver) throw new ErrorResponse("User not found", 409);
        return driver;
      } catch (error) {
        throw error;
      }
    };


    static deleteDriver = async (id: string) : Promise<boolean> => {
      try {
        const deleteProfile = await this.driverRepository.remove("_id", id);
        return !!deleteProfile; // Return true if deleteProfile is not null/undefined, otherwise false
      } catch (error) {
        throw error
      }
    }  


}

export default DriverService;
