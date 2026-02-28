import { Router } from "express";
import * as authController from "../controllers/authController";
import { authenticate } from "../middlewares/authenticate";
import type { AuthenticatedRequest } from "../types/auth";
import type { Response } from "express";

const router = Router();

// Public routes
router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/refresh", authController.refresh);
router.post("/logout", authController.logout);

// Protected routes
router.get("/me", authenticate, (req, res) =>
  authController.getMe(req as AuthenticatedRequest, res as Response),
);

export default router;
