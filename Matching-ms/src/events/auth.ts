import jwt from 'jsonwebtoken';
import { DriverI } from '../utils/interface';
import Driver from '../models/Driver';

const SECRET_KEY = process.env.JWT_SECRET;

export const authenticateToken = async (
  token: string
): Promise<Partial< DriverI>> => {
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

    // If no user is found
    return null;
  } catch (error) {
    throw new Error('Invalid token');
  }
};