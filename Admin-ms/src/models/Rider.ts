import mongoose, { Model, Schema } from "mongoose";
import { RiderI } from "../utils/interface";

const riderSchema = new Schema<RiderI>(
  {
    firstName: { type: String },
    lastName: { type: String },
    email: { type: String },
    phone: { type: String },
    isVerified: { type: Boolean, default: false },
    avatar: { type: String },
    otp: { type: Number },
    otpExpire: { type: Date },
    role: {type: String, enum: ["driver", "rider"], default: "rider" },
    driverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Driver",
    },
    is_new: {type: Boolean, default: true},
    googleId: {type: String},
    location: {
      type: {
        type: String,
        enum: ['Point'],
        // required: true
      },
      coordinates: {
        type: [Number],
        // required: true
      }
    },
  },
  {
    timestamps: true,
    toJSON: { getters: true },
    toObject: { getters: false } // Change this to false
  },

);


// Create the 2dsphere index
riderSchema.index({ location: "2dsphere" });

const Rider: Model<RiderI> = mongoose.model<RiderI>("Rider", riderSchema);
export default Rider;
