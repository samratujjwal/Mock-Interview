import { Router } from "express";
import { getHealth, getPing } from "../controllers/health.controller.js";

const router = Router();

router.get("/health", getHealth);
router.get("/ping", getPing);

export default router;
