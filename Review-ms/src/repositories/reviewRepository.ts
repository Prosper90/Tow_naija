import Driver from "../models/Review";
import { ReviewI } from "../utils/interface";
import BaseRepository from "./baseRepository";

class ReviewRepository extends BaseRepository<ReviewI> {
  constructor() {
    super(Driver);
  }
}

export default ReviewRepository;
