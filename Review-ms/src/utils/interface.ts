import { Document } from "mongoose";

export interface ReviewI extends Document {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  driverLiscense?: string;
  balance: number;
  isVerified: boolean;
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

export interface ReviewI extends Document {
  driverId: string| Object;
  rate: number;
  comment: string;
}


export interface Config {
  MONGO_URI: string;
  JWT_SECRET: string;
  PORT: number | string;
  HOSTNAME: string;
}

