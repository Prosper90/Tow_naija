import { Document } from "mongoose";

export interface RiderI extends Document {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  isVerified: boolean;
  avatar: string;
  otp?: number;
  otpExpire?: Date | string;
  role: string;
  driverId?: string | Object;
  googleId: string;
  location?: {
    type: "Point";
    coordinates: [number, number]; // [longitude, latitude]
  }
}


export interface Config {
  MONGO_URI: string;
  JWT_SECRET: string;
  PORT: number | string;
  HOSTNAME: string;
  KAFKA_BROKER: string;
  CLOUDINARY_CLOUD_NAME: string,
  CLOUDINARY_API_KEY: string,
  CLOUDINARY_API_SECRET: string
}


export interface CloudinaryResponse {
  public_id: string;
  url: string;
  path: string;
}

