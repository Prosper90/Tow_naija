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



    // In DriverService
    static TakePercent = async (
      id: string,
    ): Promise<DriverI> => {
      try {

        const driverFound = await this.driverRepository.findById(id);
        const percentTake = driverFound.balance * 15/100;

        if(percentTake <= 0) {
          throw 'Driver has insufficient funds'
        }

        //make necessary api call
        const driver = await this.driverRepository.decrement(id, percentTake);
        if (!driver) throw new ErrorResponse("Driver not found", 401);
        return driver;
      } catch (error) {
        throw error;
      }
    };



    static GetLocation = async (id: string) : Promise<Partial<DriverI["location"]> | {error: string}> => {
      try {
        const driverFound = await this.driverRepository.findById(id);
        if (!driverFound || !driverFound.location) {
          // throw new ErrorResponse("Driver not found or location is missing", 401);
          return { error: 'Driver not found or location is missing' }
        }

        return driverFound.location;
      } catch (error) {
        throw error;
      }
    }

}

export default DriverService;
