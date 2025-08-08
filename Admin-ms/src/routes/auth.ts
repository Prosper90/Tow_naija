import { Router } from "express";
import AuthController from "../controllers/authController";
import authMiddleware from "../middleware/auth";

const router = Router();

//admin
router.post("/register", AuthController.register);
router.post("/login", AuthController.login);


export default router;
