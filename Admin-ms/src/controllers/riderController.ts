import { NextFunction, Request, Response } from "express";
import RiderRepository from "../repositories/riderRepository";
import RiderService from "../services/riderService";

RiderService.setRepository(new RiderRepository());
// DriverService.setRepository(new DriverRepository());


class RiderController {


  //rider
  static getRiders = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> => {
    try {
      
      const drivers = await RiderService.getAll();

      res
        .status(200)
        .json({ 
          status: true, 
           data: drivers
        });

    } catch (error) {
      next(error);
    } 
  };


  static getARider = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> => {
    try {
      const { riderId } = req.params;

      const rider = await RiderService.getOne(riderId);

      res.status(200).json({ status: true, data: rider });
    } catch (error) {
      next(error);
    }
  };


  static updateRider = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> => {
    try {
      const { dataToUpdate, riderId } = req.body;

      const updatedDriver = await RiderService.updateRider(riderId, dataToUpdate);

      res.status(200).json({ status: true, data: updatedDriver });
    } catch (error) {
      next(error);
    }
  };




  static DeleteRider = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> => {
    try {
      const { riderId } = req.body;

      await RiderService.deleteRider(riderId as string);
      res.status(200).json({ message: "Profile deleted successfully" });
    } catch (error) {
      next(error);
    }
  };




}

export default RiderController;
