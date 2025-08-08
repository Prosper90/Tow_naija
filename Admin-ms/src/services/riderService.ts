import { randomInt } from "crypto";
import RiderRepository from "../repositories/riderRepository";
import { RiderI } from "../utils/interface";
import JWT from "../utils/jwt";
import ErrorResponse from "../utils/errorResponse";




class RiderService {

  private static riderRepository: RiderRepository;

  // Inject the repository
  static setRepository(repo: RiderRepository) {
    this.riderRepository = repo;
  }


 static getAll = async (): Promise<RiderI[] | null> => {
      try {

        // Check if a review already exists for the driver
        const existingriders = await this.riderRepository.findAll();
        if (!existingriders) {
          throw new Error("No drivers currently.");
        }
  
        // return the reviews
        return existingriders;
      } catch (error) {
        throw error;
      }
    };



    static getOne = async (
      driverId: string,
    ): Promise<RiderI | null> => {
      try {
        // Validate the input
        if (!driverId) {
          throw new ErrorResponse("Enter driver id", 409);
        }
  
        // Check if that driver exists
        const existingdriver = await this.riderRepository.findById(driverId as string);
        if (!existingdriver) {
          throw new ErrorResponse("Driver does not exist", 409);
        }
  
        // return the reviews
        return existingdriver;
      } catch (error) {
        throw error;
      }
    };



    static updateRider = async (
      id: string,
      profileData: Partial<RiderI>
    ): Promise<RiderI> => {
      try {
        
        const driver = await this.riderRepository.update("_id", id, profileData);
        if (!driver) throw new ErrorResponse("User not found", 409);
        return driver;
      } catch (error) {
        throw error;
      }
    };


    static deleteRider = async (id: string) : Promise<boolean> => {
      try {
        const deleteProfile = await this.riderRepository.remove("_id", id);
        return !!deleteProfile; // Return true if deleteProfile is not null/undefined, otherwise false
      } catch (error) {
        throw error
      }
    }  


}

export default RiderService;
