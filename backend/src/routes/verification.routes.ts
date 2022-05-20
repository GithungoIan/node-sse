import { Router } from "express";
import verifier from "../controllers/verification.controller";
const router = Router();

router.get("/phone-numbers/:file", verifier);
export default router;
