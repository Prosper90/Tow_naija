import { Router } from "express";
import RiderController from "../controllers/riderController";
import authMiddleware from "../middleware/auth";

const router = Router();

//rider
router.get("/riders", authMiddleware, RiderController.getRiders);

router.get("/riders/:riderId", authMiddleware, RiderController.getARider);

// router.post("/update_rider/:id", authMiddleware, RideController.UpdateRide);

router.delete("/rider", authMiddleware, RiderController.DeleteRider);



export default router;
