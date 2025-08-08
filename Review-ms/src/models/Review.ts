import mongoose, { Model, Schema } from "mongoose";
import { ReviewI } from "../utils/interface";

const reviewSchema = new Schema<ReviewI>(
  {
    driverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Drivers",
      required: true,
    },
    rate: {type: Number},
    comment: {type: String}
  },
  {
    timestamps: true,
  },

);



const Review: Model<ReviewI> = mongoose.model<ReviewI>("Review", reviewSchema);
export default Review;
