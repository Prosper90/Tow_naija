import DriverRepository from '../repositories/driverRepository';
import { DriverI } from '../utils/interface';


class DriverService {

private static driverRepository: DriverRepository;

  // Inject the repository
  static setRepository(repo: DriverRepository) {
    this.driverRepository = repo;
  }


   static getDriver = async (driverId: string) : Promise <DriverI> => {
    try {
      const driver = await this.driverRepository.findById(driverId);
      if (!driver) throw new Error("Driver not found");

      return driver;
    } catch (error) {
      throw error;
    }
   }

    static getDriverBalance = async (driverId: string): Promise<number> => {
      try {
        const driver = await this.driverRepository.findById(driverId);
        if (!driver) throw new Error("Driver not found");

        return driver.balance;
      } catch (error) {
        throw error;
      }
    };

}

export default DriverService;