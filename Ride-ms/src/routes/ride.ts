import { Router } from "express";
import RideController from "../controllers/rideController";
import authMiddleware from "../middleware/auth";

const router = Router();

//rider
router.post("/rider/request_ride", authMiddleware, RideController.requestRide);
router.post("/rider/accept_ride", authMiddleware, RideController.AcceptRide);
// router.post("/rider/wating_for_driver", authMiddleware, RideController.WaitForDriver);
router.post("/rider/cancel_ride", authMiddleware, RideController.CancelRide);

//driver
router.post("/driver/driver_arrived", authMiddleware, RideController.DriverArrived);
router.post("/driver/start_ride", authMiddleware, RideController.StartRide);
router.post("/driver/complete_ride", authMiddleware, RideController.CompletedRide);

//ride
router.get("/ride_details/:id", authMiddleware, RideController.getRideDetails);


export default router;
