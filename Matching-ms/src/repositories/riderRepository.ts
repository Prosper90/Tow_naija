import Rider from "../models/Rider";
import { RiderI } from "../utils/interface";
import BaseRepository from "./baseRepository";

class RiderRepository extends BaseRepository<RiderI> {
  constructor() {
    super(Rider);
  }
}

export default RiderRepository;
