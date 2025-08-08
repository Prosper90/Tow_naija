import { randomInt } from "crypto";
import DriverRepository from "../repositories/driverRepository";
import { DriverI, RiderI } from "../utils/interface";
import bcrypt from "bcrypt";
import JWT from "../utils/jwt";


class DriverService {


  private static driverRepository: DriverRepository;

      // Inject the repository
  static setRepository(repo: DriverRepository) {
    this.driverRepository = repo;
  }

  /**
   *
   * @param otp
   * @returns Driver object
   */
  static updateLocation = async (id: string, locationData: {latitude: number; longitude: number} ): Promise<any> => {
    try {

        // Validate coordinates
        if (locationData.latitude < -90 || locationData.latitude > 90) {
          return { error: 'Invalid latitude value'};
        }
        if (locationData.longitude < -180 || locationData.longitude > 180) {
          return {error: 'Invalid longitude value'};
        }

       await this.driverRepository.update(
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

export default DriverService;
