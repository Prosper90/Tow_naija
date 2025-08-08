import { Router } from "express";
import AuthController from "../controllers/authController";
import authMiddleware from "../middleware/auth";
import uploadFields from "../middleware/upload";

const router = Router();

router.post("/send_otp", uploadFields, AuthController.SendOtp);
router.post("/verify_otp", AuthController.VerifyOtp);

export default router;
