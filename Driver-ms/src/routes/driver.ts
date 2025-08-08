import { Router } from "express";
import authMiddleware from "../middleware/auth";
import DriverController from "../controllers/driverController";
import uploadFields from "../middleware/upload";

const router = Router();

router.put(
  "/notify_online",
  authMiddleware,
  DriverController.NotifyOnlineStatus
);
router.get("/driver", authMiddleware, DriverController.GetDriver);
router.get("/has_account/:emailorphone", DriverController.HasAccount);
router.put(
  "/create_passcode",
  authMiddleware,
  DriverController.CreatePasscode
);
router.put("/update_profile", uploadFields, authMiddleware, DriverController.UpdateProfile);
router.post("/deposit", authMiddleware, DriverController.Deposit);
router.post("/verify_account_number", authMiddleware, DriverController.VerifyAccountNumber);
router.get("/get_banks", authMiddleware, DriverController.GetBanks);
router.post("/withdraw", authMiddleware, DriverController.Withdrawal);
router.get("/handlepay_callback",  DriverController.handlePaystackCallback);
router.delete("/delete_profile",  DriverController.DeleteProfile);


export default router;
