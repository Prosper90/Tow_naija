import Admin from "../models/Admin";
import { AdminI } from "../utils/interface";
import BaseRepository from "./baseRepository";

class AdminRepository extends BaseRepository<AdminI> {
  constructor() {
    super(Admin);
  }
}

export default AdminRepository;
