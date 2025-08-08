import { randomInt } from "crypto";
import RiderRepository from "../repositories/riderRepository";
import { RiderI } from "../utils/interface";
import JWT from "../utils/jwt";
import ErrorResponse from "../utils/errorResponse";




class RiderService {

  private static riderRepository: RiderRepository;

  // Inject the repository
  static setRepository(repo: RiderRepository) {
    this.riderRepository = repo;
  }



  static GetLocation = async (id: string) : Promise<Partial<RiderI["location"]> | {error: string}> => {
    try {
      const riderFound = await this.riderRepository.findById(id);
      if (!riderFound || !riderFound.location) {
        // throw new ErrorResponse("Rider not found or location is missing", 401);
        return { error: 'Rider not found or location is missing' }

      }

      return riderFound.location;
    } catch (error) {
      throw error;
    }
  }

}

export default RiderService;
