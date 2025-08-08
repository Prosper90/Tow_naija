import mongoose from "mongoose";
import Ride from "../models/Ride";
import { ReviewI, RideI } from "../utils/interface";
import BaseRepository from "./baseRepository";
import ErrorResponse from "../utils/errorResponse";
import Review from "../models/Review";



interface RideDetailsResponse extends RideI {
  driverRating?: number;
  totalReviews?: number;
}

class RideRepository extends BaseRepository<RideI> {
  constructor() {
    super(Ride);
  }



  async getDriverRating(driverId: mongoose.Types.ObjectId) {
    const driverRating = await Review.aggregate([
      
      {
        $match: {
          driverId: driverId
        }
      },
      {
        $group: {
          _id: "$driverId",
          averageRating: {
            $avg: "$rate"
          },
          totalReviews: {
            $sum: 1
          }
        }
      }
    ]);

    return {
      rating: driverRating[0]?.averageRating || 0,
      totalReviews: driverRating[0]?.totalReviews || 0
    };
  }
  




  async getRideWithDetails(rideId: string): Promise<RideDetailsResponse> {
    const populateOptions = [
      {
        path: 'driverId',
        select: 'firstName lastName avatar phone'
      },
      {
        path: 'riderId',
        select: 'firstName lastName avatar phone'
      }
    ];

    const rideDetails = await this.findOneByFieldAndPopulateSelect(
      { "_id": rideId },
      populateOptions
    );

    if (!rideDetails) {
      throw new ErrorResponse("ride details doesn't exist", 401);
    }

    if (rideDetails.driverId) {
      const { rating, totalReviews } = await this.getDriverRating(rideDetails.driverId._id);
      return {
        ...rideDetails,
        driverRating: rating,
        totalReviews
      };
    }

    return rideDetails;
  }
  
}

export default RideRepository;
