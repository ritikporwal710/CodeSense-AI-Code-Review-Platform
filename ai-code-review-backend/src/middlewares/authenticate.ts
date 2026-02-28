import type { Response, NextFunction } from "express";
import type { AuthenticatedRequest } from "../types/auth";
import { verifyAccessToken } from "../utils/jwt";
import logger from "../utils/logger";

export const authenticate = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): void => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({ message: "No token provided" });
      return;
    }

    const token = authHeader.split(" ")[1];
    const payload = verifyAccessToken(token);
    req.user = payload;
    next();
  } catch (error) {
    logger.warn("Invalid access token", {
      error: error instanceof Error ? error.message : "Unknown",
    });
    res.status(401).json({ message: "Invalid or expired token" });
  }
};
