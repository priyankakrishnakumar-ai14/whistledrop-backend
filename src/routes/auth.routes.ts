import { Router } from "express";
import {
  register,
  login,
} from "../controllers/auth.controller";
import {
  authenticateModerator,
  AuthenticatedRequest,
} from "../middleware/auth.middleware";

const router = Router();

router.post("/register", register);
router.post("/login", login);

router.get(
  "/me",
  authenticateModerator,
  (req: AuthenticatedRequest, res) => {
    res.status(200).json({
      success: true,
      message: "Authentication successful",
      data: {
        moderator: req.moderator,
      },
    });
  }
);

export default router;