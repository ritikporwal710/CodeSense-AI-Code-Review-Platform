import { Router } from "express";
import * as reviewController from "../controllers/reviewController";
import { authenticate } from "../middlewares/authenticate";
import type { AuthenticatedRequest } from "../types/auth";
import type { Response } from "express";

const router = Router();

// All review routes require authentication
router.use(authenticate);

router.post("/", (req, res) =>
  reviewController.submitReview(req as AuthenticatedRequest, res as Response),
);

router.get("/", (req, res) =>
  reviewController.getMyReviews(req as AuthenticatedRequest, res as Response),
);

router.get("/:id", (req, res) =>
  reviewController.getReviewById(req as AuthenticatedRequest, res as Response),
);

export default router;
