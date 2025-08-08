import { Router } from "express";
import AdminController from "../controllers/adminController";
import authMiddleware from "../middleware/auth";

const router = Router();

//rider
router.get("/get_admins", authMiddleware, AdminController.getAdmins);
router.get("/get_admin/:adminId", authMiddleware, AdminController.getAnAdmin);
router.put("/update_admin", authMiddleware, AdminController.updateAdmin);

router.post("/create_Admin", authMiddleware, AdminController.CreateAdmin);

// router.post("/assign_admin", authMiddleware, AdminController.assignAdmin);
router.delete("/remove_admin", authMiddleware, AdminController.DeleteAdmin);

export default router;
