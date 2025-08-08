import RideRepository from '../repositories/rideRepository';
import ErrorResponse from '../utils/errorResponse';
import { RideI } from '../utils/interface';


class RideService {

private static rideRepository: RideRepository;

  // Inject the repository
  static setRepository(repo: RideRepository) {
    this.rideRepository = repo;
  }


   static async createRide(data: Partial<RideI>) {
    try {
        const ride = await this.rideRepository.create(data);
        return ride;
    } catch (error) {
        throw error;
    }
  }


  static updateStatus = async (rideId: string, options: Partial<RideI>): Promise<RideI> => {
      try {
        // const ride = await this.rideRepository.update("_id", rideId, {'status' : status as "Searching" | "Matching" | "Matched" | "Completed" | "Cancelled" | 'Failed'});
        const ride = await this.rideRepository.update("_id", rideId, options);
        if (!ride) throw new ErrorResponse("Ride not found", 401);
        return ride;
      } catch (error) {
        throw error;
      }
  };


  static getRideDetails = async (rideId: string) : Promise<RideI> => {
    try {
      return await this.rideRepository.getRideWithDetails(rideId);
    } catch (error) {
      throw error;
    }
  }


}

export default RideService;