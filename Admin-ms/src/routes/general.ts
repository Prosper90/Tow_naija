import { Router } from "express";
import GeneralController from "../controllers/generalController";
import authMiddleware from "../middleware/auth";

const router = Router();

//rider
router.get("/general_data", authMiddleware, GeneralController.getData);

export default router;
