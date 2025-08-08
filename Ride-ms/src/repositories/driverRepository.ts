import Driver from "../models/Driver";
import { DriverI } from "../utils/interface";
import BaseRepository from "./baseRepository";

class DriverRepository extends BaseRepository<DriverI> {
  constructor() {
    super(Driver);
  }
}

export default DriverRepository;
