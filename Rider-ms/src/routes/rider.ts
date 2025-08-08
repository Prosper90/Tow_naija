import { Router } from "express";
import RiderController from "../controllers/riderController";
import authMiddleware from "../middleware/auth";
import uploadFields from "../middleware/upload";

const router = Router();

router.get("/get_rider/:id", RiderController.getRiderDetails);
router.get("/has_account/:emailorphone", RiderController.HasAccount);
router.put("/update_profile", uploadFields, authMiddleware, RiderController.UpdateProfile);
router.delete("/delete_profile",  RiderController.DeleteProfile);


export default router;
