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

export interface RiderI extends Document {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  isVerified: boolean;
  is_new: boolean;
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
}
