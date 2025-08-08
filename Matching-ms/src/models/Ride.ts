import mongoose, { Model, Schema } from "mongoose";
import { RideI } from "../utils/interface";

const rideSchema = new Schema<RideI>(
    {
        riderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Rider', required: true },
        driverId: { type: mongoose.Schema.Types.ObjectId, ref: 'Driver', },
        pickupLocation: {
          latitude: { type: Number },
          longitude: { type: Number},
          address: { type: String },
        },
        dropoffLocation: {
          latitude: { type: Number },
          longitude: { type: Number },
          address: { type: String },
        },
        status: {
          type: String,
          enum: ['Searching', 'Matching', 'Matched',  'DriverArrived', 'InProgress', 'Completed', 'Cancelled', 'Failed'],
          default: 'Searching',
        },
        fare: { type: Number, default: 0 },
        distance: { type: Number, default: 0 },
        duration: { type: Number, default: 0 },
        paymentStatus: {
          type: String,
          enum: ['Pending', 'Paid', 'Failed'],
          default: 'Pending',
        },
        tow_info: {
            tow_type: {type: String},
            vehicle_make: {type: String},
            vehicle_model: {type: String},
            vehicle_year: {type: String},
        }
      },
  {
    timestamps: true,
    toJSON: { getters: true },
    toObject: { getters: false } // Change this to false
  },

);

const Ride: Model<RideI> = mongoose.model<RideI>("Ride", rideSchema);
export default Ride;
