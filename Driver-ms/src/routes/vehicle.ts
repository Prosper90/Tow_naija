import { Router } from "express";
import authMiddleware from "../middleware/auth";
import VehicleController from "../controllers/vehicleController";
import uploadFields from "../middleware/upload";

const router = Router();


router.post("/add_vehicle", uploadFields, authMiddleware, VehicleController.createVehicle);
router.get("/vehicle_info", authMiddleware, VehicleController.getVehicleInfo);
router.post(
  "/update_vehicle_info",
  uploadFields,
  authMiddleware,
  VehicleController.updateVehicleInfo
);

export default router;
