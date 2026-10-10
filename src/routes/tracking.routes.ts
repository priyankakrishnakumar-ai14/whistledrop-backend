import { Router } from "express";
import { trackReport } from "../controllers/tracking.controller";

const router = Router();

router.get("/:caseCode", trackReport);

export default router;