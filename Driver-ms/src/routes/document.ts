import { Router } from "express";
import authMiddleware from "../middleware/auth";
import DocumentsController from "../controllers/documentsController";
import uploadFields from "../middleware/upload";

const router = Router();


router.post("/add_documents", uploadFields, authMiddleware, DocumentsController.createDocument);
router.get("/documents", authMiddleware, DocumentsController.getDocuments);
router.put(
  "/update_documents",
  uploadFields,
  authMiddleware,
  DocumentsController.updateDocuments
);

export default router;
