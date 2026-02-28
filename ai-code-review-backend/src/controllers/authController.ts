import type { Request, Response } from "express";
import { z } from "zod";
import * as authService from "../services/authService";
import logger from "../utils/logger";
import type { AuthenticatedRequest } from "../types/auth";

const registerSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  name: z.string().min(2, "Name must be at least 2 characters"),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const parsed = registerSchema.safeParse(req.body);
    if (!parsed.success) {
      res
        .status(400)
        .json({
          message: "Validation error",
          errors: parsed.error.flatten().fieldErrors,
        });
      return;
    }

    const { email, password, name } = parsed.data;
    const result = await authService.registerUser(email, password, name);

    res.status(201).json({
      message: "Registration successful",
      user: result.user,
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Registration failed";
    logger.error("Register error", { error: message });
    const statusCode = message.includes("already exists") ? 409 : 500;
    res.status(statusCode).json({ message });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
      res
        .status(400)
        .json({
          message: "Validation error",
          errors: parsed.error.flatten().fieldErrors,
        });
      return;
    }

    const { email, password } = parsed.data;
    const result = await authService.loginUser(email, password);

    res.status(200).json({
      message: "Login successful",
      user: result.user,
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Login failed";
    logger.error("Login error", { error: message });
    res.status(401).json({ message });
  }
};

export const refresh = async (req: Request, res: Response): Promise<void> => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      res.status(400).json({ message: "Refresh token is required" });
      return;
    }

    const tokens = await authService.refreshAccessToken(refreshToken);
    res.status(200).json(tokens);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Token refresh failed";
    logger.error("Refresh token error", { error: message });
    res.status(401).json({ message });
  }
};

export const logout = async (req: Request, res: Response): Promise<void> => {
  try {
    const { refreshToken } = req.body;
    if (refreshToken) {
      await authService.logoutUser(refreshToken);
    }
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    logger.error("Logout error", { error });
    res.status(200).json({ message: "Logged out" }); // Always succeed on logout
  }
};

export const getMe = async (
  req: AuthenticatedRequest,
  res: Response,
): Promise<void> => {
  res.status(200).json({ user: req.user });
};
