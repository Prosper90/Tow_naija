import { Router } from "express";
import authMiddleware from "../middleware/auth";
import TransactionController from "../controllers/transactionController";

const router = Router();


router.get("/get_all_tx", authMiddleware, TransactionController.getTxs);
router.get("/get_tx/:id", authMiddleware, TransactionController.getParticularTX);

export default router;
