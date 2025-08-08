import Vehicle from "../models/Vehicle";
import { VehicleI } from "../utils/interface";
import BaseRepository from "./baseRepository";

class VehicleRepository extends BaseRepository<VehicleI> {
  constructor() {
    super(Vehicle);
  }
}

export default VehicleRepository;
