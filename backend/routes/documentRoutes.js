import express from "express";
import protect from "../middleware/auth.js";
import upload from "../config/multer.js";

import {
  uploadDocument,
  getDocuments,
  getDocument,
  deleteDocument,
} from "../controllers/documentController.js";
const router = express.Router();

//All routes are protected
router.use(protect);

router.post("/upload", upload.single("file"), uploadDocument);
router.get("/", getDocuments);
router.get("/:id", getDocument);
router.delete("/:id", deleteDocument);

export default router;
