import Ride from "../models/Ride";
import { RideI } from "../utils/interface";
import BaseRepository from "./baseRepository";


type RideStatus = 'Matched' | 'DriverArrived' | 'InProgress';

class RideRepository extends BaseRepository<RideI> {
  constructor() {
    super(Ride);
  }


  static getActiveRides = async () => {
    try {
      const activeStatuses: RideStatus[] = ['Matched', 'DriverArrived', 'InProgress'];
      
      const rides = await Ride.find({
        status: { 
          $in: activeStatuses 
        }
      });

      // console.log(rides, "checking rides hereeee");

      return rides;
    } catch (error) {
      throw error;
    }
  }

}

export default RideRepository;
