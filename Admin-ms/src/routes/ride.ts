import { Router } from "express";
import RideController from "../controllers/rideController";
import authMiddleware from "../middleware/auth";

const router = Router();

//rides
router.get("/rides", authMiddleware, RideController.getRides);
router.get("/ride/:rideId", authMiddleware, RideController.getARide);

router.delete("/ride", authMiddleware, RideController.DeleteRide);


export default router;
