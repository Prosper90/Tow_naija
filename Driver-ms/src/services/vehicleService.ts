import { VehicleI } from "../utils/interface";
import VehicleRepository from "../repositories/vehicleRepository";
import ErrorResponse from "../utils/errorResponse";

// const vehicleRepository = new VehicleRepository();

class VehicleService {
  private static vehicleRepository: VehicleRepository;


  static setRepository(repo: VehicleRepository) {
    this.vehicleRepository = repo;
  }

  /**
   *
   * @param id
   * @returns
   */
  static getVehicleInfo = async (id: string): Promise<VehicleI> => {
    try {
      //find the documents by id
      const findDriver = await this.vehicleRepository.findOneByField({
        driverId: id,
      });
      if (!findDriver) {
        throw new ErrorResponse("this driver hasn't submitted vehicle information", 401);
      }

      return findDriver;
    } catch (error) {
      throw error;
    }
  };

   static isVehicle = async (id: string): Promise<boolean> => {
    try {
      //find the documents by id
      const findDriver = await this.vehicleRepository.findOneByField({
        driverId: id,
      });
      if (!findDriver) {
        return false
      }

      return true;
    } catch (error) {
      throw error;
    }
  };

  /**
   *
   * @param id
   * @param options
   * @returns
   */
  static submitVehicleInfo = async (
    id: string,
    options: Partial<VehicleI>
  ): Promise<VehicleI> => {
    try {
      //check if this user has a document already
      const checkExistingVehicle = await this.vehicleRepository.findOneByField({
        driverId: id,
      });
      if (checkExistingVehicle) {
        throw new ErrorResponse("Vehicle aleady submitted", 401);
      }

      //create new document
      const newDoc = await this.vehicleRepository.create(options);
      return newDoc;
    } catch (error) {
      throw error;
    }
  };

  /**
   *
   * @param id
   * @param options
   * @returns
   */
  static updateVehicleInfo = async (id: string, options: Partial<VehicleI>) => {
    try {
      const docUpdated = await this.vehicleRepository.update(
        "driverId",
        id,
        options
      );
      if (!docUpdated) throw new ErrorResponse("Driver vehicle info not found", 401);
      return docUpdated;
    } catch (error) {
      throw error;
    }
  };
}

export default VehicleService;
