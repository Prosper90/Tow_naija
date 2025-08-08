import Logger from "../middleware/log";
import Driver from "../models/Driver";
import { DriverI, Location } from "../utils/interface";
import BaseRepository from "./baseRepository";

class DriverRepository extends BaseRepository<DriverI> {
  constructor() {
    super(Driver);
  }


  async findNearbyDrivers(location: Location, radiusInKm: number = 5): Promise<DriverI[]> {
    try {

      let drivers;

      // Log the search parameters
      // console.log('Searching for drivers with params:', {
      //   coordinates: [location.longitude, location.latitude],
      //   radius: radiusInKm,
      // });
  
      // console.log('Total online drivers:', onlineDrivers.length);
      // find drivers
       drivers = await Driver.find({
        isOnline: true,
        location: {
          $near: {
            $geometry: {
              type: "Point",
              coordinates: [location.longitude, location.latitude]
            },
            $maxDistance: radiusInKm * 1000 // Convert km to meters
          }
        }
      });
  
      // console.log(drivers, "online drivers found in iiiii");

          // If no drivers found, let's check what drivers exist within a larger radius
    if (drivers.length === 0) {
      drivers = await Driver.find({
        isOnline: true,
        location: {
          $near: {
            $geometry: {
              type: "Point",
              coordinates: [location.longitude, location.latitude]
            },
            $maxDistance: radiusInKm * 3000 // Double the search radius
          }
        }
      });
      // console.log('Drivers in expanded radius (ignoring online status):', expandedSearch.length);
    }

      return drivers;
      
    } catch (error) {
      Logger.log('error', 'Error finding nearby drivers', error as Error);
      throw error;
    }
  }

}

export default DriverRepository;
