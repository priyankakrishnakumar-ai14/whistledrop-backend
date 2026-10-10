import { Router } from "express";
import { authenticateModerator } from "../middleware/auth.middleware";
import {
  listReports,
  getSingleReport,
  updateStatus,
} from "../controllers/moderator-report.controller";

const router = Router();

router.use(authenticateModerator);

router.get("/", listReports);

router.get("/:id", getSingleReport);

router.patch("/:id/status", updateStatus);

export default router;