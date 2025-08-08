import { Document } from "mongoose";

export interface DriverI extends Document {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  driverLiscense?: string;
  balance: number;
  isVerified: boolean;
  isApproved: boolean;
  isOnline: boolean;
  passCode?: number;
  state: string;
  lga: string;
  avatar: string;
  dob: Date | string;
  otp?: number;
  otpExpire?: Date;
  role: string;
  riderId?: string | Object;
  location?: {
    type: "Point";
    coordinates: [number, number]; // [longitude, latitude]
  }
}

export interface VehicleI extends Document {
  driverId: string | Object;
  typeOf: string;
  plateNumber: string;
  brandName: string,
  productionYear: Date | string,
  carImageWitPlate: string,
  vehicleRegistrationCertificateImage: string
}

export interface DocumentI extends Document {
  driverId: string | Object;
  vehicleId?: string | Object;
  dl?: {
    driverLiscense: string,
    driverLiscenceExpiration: Date | string,
    dl_image_front: string,
    dl_image_back: string,
  };
  vehicleRegistration: string;
  Insurance: string;
  RoadWorthinessCertificate: string;
  PermitForTowingService: string;
  CAC: string;
  isApproved: boolean;
}

export interface TransactionI extends Document {
  driverId: string | Object;
  tx_type: string,
  amount: number,
  status: string,
  ref_id: string,
}

export interface Config {
  MONGO_URI: string;
  JWT_SECRET: string;
  PORT: number | string;
  HOSTNAME: string;
  KAFKA_BROKER: string;
  CLOUDINARY_CLOUD_NAME: string,
  CLOUDINARY_API_KEY: string,
  CLOUDINARY_API_SECRET: string,
  PAYSTACK_BASE_URL: string,
  PAYSTACK_SECRET: string
}


export interface CloudinaryResponse {
  public_id: string;
  url: string;
  path: string;
}

export type DriverImageType = 'avatar' | 'license_front' | 'license_back' | 'car_plate' | 'registration_cert';