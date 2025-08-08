import { randomInt } from "crypto";
import DriverRepository from "../repositories/driverRepository";
import { AdminI, DriverI } from "../utils/interface";
import bcrypt from "bcrypt";
import JWT from "../utils/jwt";
import AdminRepository from "../repositories/adminRepository";
import ErrorResponse from "../utils/errorResponse";



class AdminService {

    private static adminRepository: AdminRepository;

      // Inject the repository
  static setRepository(repo: AdminRepository) {
    this.adminRepository = repo;
  }



    static getAll = async (): Promise<AdminI[] | null> => {
      try {

        // Check if a review already exists for the driver
        const existingdrivers = await this.adminRepository.findAll();
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
    ): Promise<AdminI | null> => {
      try {
        // Validate the input
        if (!driverId) {
          throw new ErrorResponse("Enter driver id", 409);
        }
  
        // Check if that driver exists
        const existingdriver = await this.adminRepository.findById(driverId as string);
        if (!existingdriver) {
          throw new ErrorResponse("Driver does not exist", 409);
        }
  
        // return the reviews
        return existingdriver;
      } catch (error) {
        throw error;
      }
    };



    static updateAdmin = async (
      id: string,
      profileData: Partial<AdminI>
    ): Promise<AdminI> => {
      try {
        
        const driver = await this.adminRepository.update("_id", id, profileData);
        if (!driver) throw new Error("User not found");
        return driver;
      } catch (error) {
        throw error;
      }
    };


    static deleteAdmin = async (id: string) : Promise<boolean> => {
      try {
        const deleteProfile = await this.adminRepository.remove("_id", id);
        return !!deleteProfile; // Return true if deleteProfile is not null/undefined, otherwise false
      } catch (error) {
        throw error
      }
    }  



  static login = async (email: string, password: string): Promise<{ findAdmin: AdminI; token: string }> => {
    try {
      //find the user by otp
      const findAdmin = await this.adminRepository.findOneByField({email: email})
    //   console.log(findAdmin, email, password, "checking this aspect out");
        if (!findAdmin) {
            throw new Error("User does not exist");
        }

        //check password by using bcrypt before creating token
        const isMatch = await bcrypt.compare(password, findAdmin.password);
        if (!isMatch) {
            throw new Error("Invalid password");
          }
        

        let token;
    
        const jwt = new JWT();
        token = await jwt.createToken(findAdmin._id as string);
        

        return { findAdmin: findAdmin, token };
        } catch (error) {
        throw error;
        }
    };


    static createAdmin = async (
        options: Partial<AdminI>
      ) => {
        try {

          //check if admin email already exists
          const findAdmin = await this.adminRepository.findOneByField({email: options?.email})

          if (findAdmin) {
            throw new ErrorResponse("Admin already exist", 409);
          }
    
          const createAdriver = await this.adminRepository.create(options);
          return createAdriver;
        } catch (error) {
          throw error;
        }
      };    


}

export default AdminService;
