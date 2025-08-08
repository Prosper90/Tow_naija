import Driver from "../models/Driver";
import { setupModelRelationships } from "../models/setupRelationships";
import { DriverI } from "../utils/interface";
import BaseRepository from "./baseRepository";

class DriverRepository extends BaseRepository<DriverI> {
  constructor() {
    setupModelRelationships();
    super(Driver);
  }
}

export default DriverRepository;
