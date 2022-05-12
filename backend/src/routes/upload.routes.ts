import { Router } from "express";
import { uploadFile, upoadResponse } from "../controllers/upload.controller";

const router = Router();

router.post("/upload", uploadFile, upoadResponse);

export default router;
