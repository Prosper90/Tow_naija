import { NextFunction, Request, Response } from "express";
import DriverService from "../services/driverService";
import DriverRepository from "../repositories/driverRepository";

DriverService.setRepository(new DriverRepository());


class DriverController {


  //rider
  static getDrivers = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> => {
    try {
      
      const drivers = await DriverService.getAll();

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


  static getADriver = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> => {
    try {
      const { driverId } = req.params;

      const driver = await DriverService.getOne(driverId);

      res.status(200).json({ status: true, data: driver });
    } catch (error) {
      next(error);
    }
  };


  static updateDriver = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> => {
    try {
      const { dataToUpdate, driverId } = req.body;
      

      const updatedDriver = await DriverService.updateDriver(driverId, dataToUpdate);

      res.status(200).json({ status: true, data: updatedDriver });
    } catch (error) {
      next(error);
    }
  };

  static DeleteDriver = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> => {
    try {
      const { driverId } = req.body;

      await DriverService.deleteDriver(driverId as string);
      res.status(200).json({ message: "Profile deleted successfully" });
    } catch (error) {
      next(error);
    }
  };




}

export default DriverController;
