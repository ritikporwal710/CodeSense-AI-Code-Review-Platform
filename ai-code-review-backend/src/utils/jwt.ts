import jwt from "jsonwebtoken";
import type { JwtPayload } from "../types/auth";

const ACCESS_TOKEN_SECRET =
  process.env.ACCESS_TOKEN_SECRET || "access-secret-dev-only";
const REFRESH_TOKEN_SECRET =
  process.env.REFRESH_TOKEN_SECRET || "refresh-secret-dev-only";

const ACCESS_TOKEN_EXPIRY = "15m";
const REFRESH_TOKEN_EXPIRY = "7d";
const REFRESH_TOKEN_EXPIRY_MS = 7 * 24 * 60 * 60 * 1000; // 7 days in ms

export const generateAccessToken = (
  payload: Omit<JwtPayload, "iat" | "exp">,
): string => {
  return jwt.sign(payload, ACCESS_TOKEN_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRY,
  });
};

export const generateRefreshToken = (
  payload: Omit<JwtPayload, "iat" | "exp">,
): string => {
  return jwt.sign(payload, REFRESH_TOKEN_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRY,
  });
};

export const verifyAccessToken = (token: string): JwtPayload => {
  return jwt.verify(token, ACCESS_TOKEN_SECRET) as JwtPayload;
};

export const verifyRefreshToken = (token: string): JwtPayload => {
  return jwt.verify(token, REFRESH_TOKEN_SECRET) as JwtPayload;
};

export const getRefreshTokenExpiryDate = (): Date => {
  return new Date(Date.now() + REFRESH_TOKEN_EXPIRY_MS);
};
