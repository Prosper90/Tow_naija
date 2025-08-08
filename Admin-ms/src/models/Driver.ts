import mongoose, { Model, Schema } from "mongoose";
import { DriverI } from "../utils/interface";

const driverSchema = new Schema<DriverI>(
  {
    firstName: { type: String },
    lastName: { type: String },
    email: { type: String },
    phone: { type: String },
    dob: {type: Date},
    balance: {
      type: Number,
      get: function(value: number) {
        return value ? value / 100 : value;
      },
      set: function(value: number) {
        return value ? value * 100 : value;
      },
      default: 0,
    },
    isVerified: { type: Boolean, default: false },
    isApproved: { type: Boolean, default: false },
    isOnline: { type: Boolean, default: false},
    state: { type: String },
    lga: { type: String },
    avatar: { type: String },
    otp: { type: Number },
    otpExpire: { type: Date },
    passCode: {type: Number, unique: true},
    role: {type: String, enum: ["driver", "rider"], default: "driver" },
    riderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Riders",
    },
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


//add virtual document schema
// driverSchema.virtual("documents", {
//   ref: "Document", // The model to populate
//   localField: "_id", // The field in Driver to match
//   foreignField: "driverId", // The field in Document to match
// });

// //add vehicle schima
// driverSchema.virtual("vehicle", {
//   ref: "Vehicle", // The model to populate
//   localField: "_id", // The field in Driver to match
//   foreignField: "driverId", // The field in Document to match
// });

// Create the 2dsphere index
driverSchema.index({ location: "2dsphere" });

const Driver: Model<DriverI> = mongoose.model<DriverI>("Driver", driverSchema);
export default Driver;
