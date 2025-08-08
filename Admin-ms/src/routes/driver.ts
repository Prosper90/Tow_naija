import { Router } from "express";
import authMiddleware from "../middleware/auth";
import DriverController from "../controllers/driverController";

const router = Router();

//rider
router.get("/drivers", authMiddleware, DriverController.getDrivers);

router.get("/drivers/:driverId", authMiddleware, DriverController.getADriver);

router.put("/update_driver", authMiddleware, DriverController.updateDriver);

router.delete("/delete_driver", authMiddleware, DriverController.DeleteDriver);



export default router;
