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


export interface Config {
  MONGO_URI: string;
  JWT_SECRET: string;
  PORT: number | string;
  HOSTNAME: string;
  KAFKA_BROKER: string;
}

export interface RideRequestEvent {
  rideId?: string,
  rider?: string,
  driver?: string,
  towInfo?: {
    tow_type: string,
    vehicle_make: string,
    vehicle_model: string,
    vehicle_year: string,
  },
  pickupLocation?: {
    latitude: number,
    longitude: number,
    address: string,
  },
  dropoffLocation?: {
    latitude: number,
    longitude: number,
    address: string,
  }
}


export interface Location {
  latitude: number;
  longitude: number;
  address: string;
}


export interface DriverResponse {
  rideId: string;
  driverId: string;
  driverName: string;
  price: number;
  estimatedArrival: string;
}