import { Document } from "mongoose";


export interface AdminI extends Document {
  email: string,
  role: string,
  password: string
}

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

export interface RideI extends Document {
  riderId: string | Object; // Reference to the rider
  driverId: string | Object; // Reference to the driver
  pickupLocation: {
    latitude: number;
    longitude: number;
    address?: string; // Optional, for human-readable address
  };
  dropoffLocation: {
    latitude: number;
    longitude: number;
    address?: string;
  };
  status: 'Searching' | 'Matching' | 'Matched' | 'DriverArrived' | 'InProgress' | 'Completed' | 'Cancelled' | 'Failed' ; // Ride status
  fare: number; // Ride fare
  distance: number; // Distance in kilometers
  duration: number; // Duration in minutes
  paymentStatus: 'Pending' | 'Paid' | 'Failed'; // Payment status
  tow_info: {
    tow_type: string,
    vehicle_make: string,
    vehicle_model: string,
    vehicle_year: string,
  }
  createdAt: Date;
  updatedAt: Date;
}

export interface ReviewI extends Document {
  driverId: string| Object;
  rate: number;
  comment: string;
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
}
