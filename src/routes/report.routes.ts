import { Router } from "express";
import { submitReport } from "../controllers/report.controller";

const router = Router();

router.post("/", submitReport);

export default router;