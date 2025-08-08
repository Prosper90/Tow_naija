import { Router } from "express";
import AuthController from "../controllers/authController";
import authMiddleware from "../middleware/auth";

const router = Router();

router.post("/send_otp", AuthController.SendOtp);
router.post("/verify_otp", AuthController.VerifyOtp);
router.post("/google_signup", AuthController.SignUpGoogle);

export default router;
