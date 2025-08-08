import RideRepository from '../repositories/rideRepository';
import ErrorResponse from '../utils/errorResponse';
import { RideI } from '../utils/interface';


class RideService {

private static rideRepository: RideRepository;

  // Inject the repository
  static setRepository(repo: RideRepository) {
    this.rideRepository = repo;
  }


   static getAll = async (): Promise<RideI[] | null> => {
        try {
  
          // Check if a review already exists for the driver
          const existingdrivers = await this.rideRepository.findAll();
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
        rideId: string,
      ): Promise<RideI | null> => {
        try {
          // Validate the input
          if (!rideId) {
            throw new Error("Enter driver id");
          }
    
          return await this.rideRepository.getRideWithDetails(rideId);

        } catch (error) {
          throw error;
        }
      };
  
  
  
      static updateRider = async (
        id: string,
        newData: Partial<RideI>
      ): Promise<RideI> => {
        try {
          
          const updatedRide = await this.rideRepository.update("_id", id, newData);
          if (!updatedRide) throw new Error("User not found");
          return updatedRide;
        } catch (error) {
          throw error;
        }
      };
  
  
      static deleteRide = async (id: string) : Promise<boolean> => {
        try {
          const deleteProfile = await this.rideRepository.remove("_id", id);
          return !!deleteProfile; // Return true if deleteProfile is not null/undefined, otherwise false
        } catch (error) {
          throw error
        }
      }  


}

export default RideService;