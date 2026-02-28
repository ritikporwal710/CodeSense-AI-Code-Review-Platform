import type { Response } from "express";
import { z } from "zod";
import type { AuthenticatedRequest } from "../types/auth";
import * as reviewService from "../services/reviewService";
import logger from "../utils/logger";

const submitReviewSchema = z.object({
  title: z.string().min(1, "Title is required").max(255),
  language: z.string().min(1, "Language is required"),
  code: z.string().min(10, "Code must be at least 10 characters"),
});

export const submitReview = async (
  req: AuthenticatedRequest,
  res: Response,
): Promise<void> => {
  try {
    const parsed = submitReviewSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({
        message: "Validation error",
        errors: parsed.error.flatten().fieldErrors,
      });
      return;
    }

    const { title, language, code } = parsed.data;
    const userId = req.user!.userId;

    const review = await reviewService.analyzeCode(
      userId,
      title,
      language,
      code,
    );
    res.status(201).json({ message: "Review completed", review });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Review failed";
    logger.error("Submit review error", { error: message });
    res.status(500).json({ message });
  }
};

export const getMyReviews = async (
  req: AuthenticatedRequest,
  res: Response,
): Promise<void> => {
  try {
    const userId = req.user!.userId;
    const reviews = await reviewService.getReviewsByUser(userId);
    res.status(200).json({ reviews });
  } catch (error) {
    logger.error("Get reviews error", { error });
    res.status(500).json({ message: "Failed to fetch reviews" });
  }
};

export const getReviewById = async (
  req: AuthenticatedRequest,
  res: Response,
): Promise<void> => {
  try {
    const id = req.params["id"] as string;
    const userId = req.user!.userId;
    const review = await reviewService.getReviewById(id, userId);

    if (!review) {
      res.status(404).json({ message: "Review not found" });
      return;
    }

    res.status(200).json({ review });
  } catch (error) {
    logger.error("Get review by id error", { error });
    res.status(500).json({ message: "Failed to fetch review" });
  }
};
