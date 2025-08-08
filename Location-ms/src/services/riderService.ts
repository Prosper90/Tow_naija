import { randomInt } from "crypto";
import RiderRepository from "../repositories/riderRepository";
import { RiderI } from "../utils/interface";
import JWT from "../utils/jwt";




class RiderService {

  private static riderRepository: RiderRepository;

  // Inject the repository
  static setRepository(repo: RiderRepository) {
    this.riderRepository = repo;
  }

  /**
   *
   * @param otp
   * @returns Rider object
   */
  static updateLocation = async (id: string, locationData: {latitude: number; longitude: number} ): Promise<any> => {
    try {

        // Validate coordinates
        if (locationData.latitude < -90 || locationData.latitude > 90) {
          return {error: 'Invalid latitude value'};
        }
        if (locationData.longitude < -180 || locationData.longitude > 180) {
          return {error: 'Invalid longitude value'};
        }


      const updateRiderLocation = await this.riderRepository.update(
        "_id",
        id,
        { 
          location: {
            type: "Point",
            coordinates: [locationData.longitude, locationData.latitude] // Note: GeoJSON format is [longitude, latitude]
          }
         },
     );

      return {success: true};
    } catch (error) {
      throw error;
    }
  };


}

export default RiderService;
