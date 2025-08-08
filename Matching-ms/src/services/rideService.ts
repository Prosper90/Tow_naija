import RideRepository from '../repositories/rideRepository';
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


    static updateRide = async (rideId: string, option: any): Promise<boolean> => {
      try {
        const ride = await this.rideRepository.update("_id", rideId, option);
        return ride ? true : false;
      } catch (error) {
        console.log(error);
      }
    };

}

export default RideService;