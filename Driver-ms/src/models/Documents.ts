import mongoose, { Model, Schema } from "mongoose";
import { DocumentI } from "../utils/interface";

const documentSchema = new Schema<DocumentI>(
  {
    driverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Drivers",
      required: true,
    },
    dl: {
      driverLiscense: { type: String },
      driverLiscenceExpiration:  {
        type: Date,
        validate: {
          validator: (value: Date) => !isNaN(value.getTime()), // Validate that the value is a valid date
          message: "Invalid date format for driver license expiration.",
        },
      },
      dl_image_front: {type: String},
      dl_image_back: {type: String},
    },
    vehicleRegistration: { type: String },
    Insurance: { type: String },
    RoadWorthinessCertificate: { type: String },
    PermitForTowingService: { type: String },
    CAC: { type: String },
    isApproved: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

const Document: Model<DocumentI> = mongoose.model<DocumentI>(
  "Document",
  documentSchema
);
export default Document;
