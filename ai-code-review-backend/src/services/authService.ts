import bcrypt from "bcrypt";
import { eq, and } from "drizzle-orm";
import { db } from "../config/db";
import { users, refreshTokens } from "../db/schema";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
  getRefreshTokenExpiryDate,
} from "../utils/jwt";
import logger from "../utils/logger";

const SALT_ROUNDS = 10;

export const registerUser = async (
  email: string,
  password: string,
  name: string,
) => {
  // Check if user already exists
  const existingUser = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (existingUser.length > 0) {
    throw new Error("User with this email already exists");
  }

  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

  const [newUser] = await db
    .insert(users)
    .values({ email, password: hashedPassword, name })
    .returning({ id: users.id, email: users.email, name: users.name });

  logger.info("User registered", { userId: newUser.id, email: newUser.email });

  const accessToken = generateAccessToken({
    userId: newUser.id,
    email: newUser.email,
  });
  const refreshToken = generateRefreshToken({
    userId: newUser.id,
    email: newUser.email,
  });

  await db.insert(refreshTokens).values({
    userId: newUser.id,
    token: refreshToken,
    expiresAt: getRefreshTokenExpiryDate(),
  });

  return { user: newUser, accessToken, refreshToken };
};

export const loginUser = async (email: string, password: string) => {
  const result = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (result.length === 0) {
    throw new Error("Invalid email or password");
  }

  const user = result[0];
  const passwordMatch = await bcrypt.compare(password, user.password);

  if (!passwordMatch) {
    throw new Error("Invalid email or password");
  }

  const accessToken = generateAccessToken({
    userId: user.id,
    email: user.email,
  });
  const refreshToken = generateRefreshToken({
    userId: user.id,
    email: user.email,
  });

  // Store refresh token
  await db.insert(refreshTokens).values({
    userId: user.id,
    token: refreshToken,
    expiresAt: getRefreshTokenExpiryDate(),
  });

  logger.info("User logged in", { userId: user.id });

  return {
    user: { id: user.id, email: user.email, name: user.name },
    accessToken,
    refreshToken,
  };
};

export const refreshAccessToken = async (token: string) => {
  // Verify the JWT signature
  const payload = verifyRefreshToken(token);

  // Check token exists and is not revoked
  const stored = await db
    .select()
    .from(refreshTokens)
    .where(
      and(eq(refreshTokens.token, token), eq(refreshTokens.revoked, false)),
    )
    .limit(1);

  if (stored.length === 0 || new Date() > stored[0].expiresAt) {
    throw new Error("Refresh token is invalid or expired");
  }

  // Revoke old refresh token (rotation strategy)
  await db
    .update(refreshTokens)
    .set({ revoked: true })
    .where(eq(refreshTokens.token, token));

  // Issue new tokens
  const newAccessToken = generateAccessToken({
    userId: payload.userId,
    email: payload.email,
  });
  const newRefreshToken = generateRefreshToken({
    userId: payload.userId,
    email: payload.email,
  });

  await db.insert(refreshTokens).values({
    userId: payload.userId,
    token: newRefreshToken,
    expiresAt: getRefreshTokenExpiryDate(),
  });

  return { accessToken: newAccessToken, refreshToken: newRefreshToken };
};

export const logoutUser = async (token: string) => {
  await db
    .update(refreshTokens)
    .set({ revoked: true })
    .where(eq(refreshTokens.token, token));
  logger.info("User logged out, refresh token revoked");
};
