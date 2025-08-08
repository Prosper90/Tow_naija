import { NextFunction, Request, Response } from "express";
import { DriverI } from "../utils/interface";
import RideRepository from "../repositories/rideRepository";
import RideService from "../services/rideService";
import { eventService } from "../services/eventService";
import DriverService from "../services/driverService";
import DriverRepository from "../repositories/driverRepository";
import TransactionRepository from "../repositories/transactionRepository";

RideService.setRepository(new RideRepository());
DriverService.setRepository(new DriverRepository());

const transactionRepository = new TransactionRepository();


class RideController {


  //rider
  static requestRide = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> => {
    try {
      const { pickupLocation, dropoffLocation, distance, towInfo }  = req.body;
      
      const ride = await RideService.createRide({
        riderId: req.user._id,
        pickupLocation: {
          latitude: pickupLocation.latitude,
          longitude: pickupLocation.longitude,
          address: pickupLocation.address,
        },
        dropoffLocation: {
          latitude: dropoffLocation.latitude,
          longitude: dropoffLocation.longitude,
          address: dropoffLocation.address,
        },
        distance: distance,
        tow_info: {
          tow_type: towInfo.tow_type,
          vehicle_make: towInfo.vehicle_make,
          vehicle_model: towInfo.vehicle_model,
          vehicle_year: towInfo.vehicle_year,
      }
      });


      await eventService.emitEvent("ride_request", {
        rideId: ride._id,
        rider: req.user._id,
        towInfo: towInfo,
        pickupLocation: pickupLocation,
        dropoffLocation: dropoffLocation
      });


      res
        .status(200)
        .json({ 
          status: true, 
          message: "Ride match successfuly",
           data: {
            rideId: ride._id,
            status: ride.status
        } });
    } catch (error) {
      next(error);
    } 
  };

  static AcceptRide = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> => {
    try {
      const { rideId, driverId, price } = req.body;

      const updatedRide = await RideService.updateStatus(rideId, {status: 'Matched', 'driverId': driverId, "fare": price});
      await DriverService.TakePercent(driverId);

      //tell match service to emit to driver that they have been picked
      await eventService.emitEvent("notify_driver_of_accepted_ride", {
        rideId: rideId,
        rider: req.user._id,
        driver: driverId,
      });

      //create a transaction
       await transactionRepository.create({
        driverId: driverId,
        tx_type: "earn",
        amount: price,
        status: "pending",
        ref_id: rideId,
        })

      res.status(200).json({ status: true, ride: updatedRide });
    } catch (error) {
      next(error);
    }
  };


  // static WaitForDriver = async (
  //   req: Request,
  //   res: Response,
  //   next: NextFunction
  // ) : Promise<any> => {
  //    try {
  //     const { rideId } = req.body;

  //     const updatedRide = await RideService.updateStatus(rideId, {status: 'WaitingForDriver'});
  //     res.status(200).json({ status: true, ride: updatedRide });

  //    } catch (error) {
  //     next(error);
  //    }
  // }

  static CancelRide = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> => {
    try {
      const { rideId } = req.body;

      const updatedRide = await RideService.updateStatus(rideId, {status: 'Cancelled', paymentStatus: 'Failed'});
      await transactionRepository.update("ref_id", rideId, {status: 'failed'});

      res.status(200).json({ status: true, ride: updatedRide });
    } catch (error) {
      next(error);
    }
  };

  //For driver
  static DriverArrived = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> => {
    try {
      const { rideId } = req.body;

      const updatedRide = await RideService.updateStatus(rideId, {status: 'DriverArrived'});

      res.status(200).json({ status: true, ride: updatedRide });
    } catch (error) {
      next(error);
    }
  };

  static StartRide = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> => {
    try {
      const { rideId } = req.body;

      const updatedRide = await RideService.updateStatus(rideId, {status: 'InProgress'});

      res.status(200).json({ status: true, ride: updatedRide });
    } catch (error) {
      next(error);
    }
  };


  static CompletedRide = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> => {
    try {
      const { rideId } = req.body;

      const updatedRide = await RideService.updateStatus(rideId, {status: 'Completed', paymentStatus: 'Paid'});
      await transactionRepository.update("ref_id", rideId, {status: 'success'});
      res.status(200).json({ status: true, ride: updatedRide });
    } catch (error) {
      next(error);
    }
  };

  static getRideDetails = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> => {
    try {
      const { id } = req.params;

      const rideDetails = await RideService.getRideDetails(id);

      res.status(200).json({ status: true, ride: rideDetails });
    } catch (error) {
      next(error);
    }
  };



}

export default RideController;
