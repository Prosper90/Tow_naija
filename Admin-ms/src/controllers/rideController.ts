import { NextFunction, Request, Response } from "express";
import { DriverI } from "../utils/interface";
import RideRepository from "../repositories/rideRepository";
import RideService from "../services/rideService";
import DriverService from "../services/driverService";
import DriverRepository from "../repositories/driverRepository";
import TransactionRepository from "../repositories/transactionRepository";

RideService.setRepository(new RideRepository());


class RideController {


  //rider
  static getRides = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> => {
    try {
    
      const rideTx = await RideService.getAll();

      res
        .status(200)
        .json({ 
          status: true, 
           data: rideTx
           });
    } catch (error) {
      next(error);
    } 
  };

  static getARide = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> => {
    try {
      const { rideId } = req.params;

      const ride = await RideService.getOne(rideId);
      res.status(200).json({ status: true, data: ride });

    } catch (error) {
      next(error);
    }
  };


  static DeleteRide = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> => {
    try {
      const { rideId } = req.body;

      const updatedRide = await RideService.deleteRide(rideId);

      res.status(200).json({ status: true, ride: updatedRide });
    } catch (error) {
      next(error);
    }
  };




}

export default RideController;
