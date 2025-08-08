import jwt from 'jsonwebtoken';
import config from '../config';
import Driver from '../models/Driver';
import Rider from '../models/Rider';
import { DriverI, RiderI } from '../utils/interface';

const SECRET_KEY = config.JWT_SECRET;

export const authenticateToken = async (
  token: string
): Promise<Partial<DriverI> | Partial<RiderI> | null> => {
  if (!token) {
    throw new Error('Token is required');
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY) as { id: string };

    // Check if the user is a Driver
    const driver = await Driver.findById(decoded.id);
    if (driver) {
      return driver.toObject() as Partial<DriverI>;
    }

    // Check if the user is a Rider
    const rider = await Rider.findById(decoded.id);
    if (rider) {
      return rider.toObject() as Partial<RiderI>;
    }

    // If no user is found
    return null;
  } catch (error) {
    throw new Error('Invalid token');
  }
};