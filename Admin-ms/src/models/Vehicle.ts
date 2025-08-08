import mongoose, { Model, Schema } from "mongoose";
import { VehicleI } from "../utils/interface";

const vehicleSchema = new Schema<VehicleI>(
  {
    driverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Drivers",
      required: false,
    },
    typeOf: {
      type: String,
      enum: ["FlatBed", "HookAndChain", "WheelLift", "Integrated"],
    },
    plateNumber: { type: String },
    brandName: {type: String},
    productionYear: {
      type: Date,
      validate: {
        validator: (value: Date) => !isNaN(value.getTime()), // Validate that the value is a valid date
        message: "Invalid date format for driver license expiration.",
      },
    },
    carImageWitPlate: {type: String},
    vehicleRegistrationCertificateImage: {type: String}
  },
  {
    timestamps: true,
  }
);

const Vehicle: Model<VehicleI> = mongoose.model<VehicleI>("Vehicle", vehicleSchema);
export default Vehicle;
