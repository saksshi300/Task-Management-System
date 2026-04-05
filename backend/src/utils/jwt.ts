// ============================================================
// JWT UTILITY FUNCTIONS
// JWT = JSON Web Token. Think of it like a temporary ID card.
// When you log in, we give you a "card" (token).
// You show this card every time you access protected pages.
// ============================================================

import jwt, { SignOptions } from "jsonwebtoken";
import { UserPayload } from "../types";

// Helper functions to safely get secrets with validation
const getAccessSecret = (): string => {
  const secret = process.env.JWT_ACCESS_SECRET;
  if (!secret) {
    throw new Error("JWT_ACCESS_SECRET is not defined in .env");
  }
  return secret;
};

const getRefreshSecret = (): string => {
  const secret = process.env.JWT_REFRESH_SECRET;
  if (!secret) {
    throw new Error("JWT_REFRESH_SECRET is not defined in .env");
  }
  return secret;
};

// Access Token = short-lived card (expires in 15 minutes)
// If someone steals it, damage is limited since it expires fast
export const generateAccessToken = (user: UserPayload): string => {
  return jwt.sign(
    { id: user.id, email: user.email, name: user.name },
    getAccessSecret(),
    {
      expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || "15m",
    } as SignOptions,
  );
};

// Refresh Token = long-lived card (expires in 7 days)
// Used ONLY to get a new Access Token when the old one expires
// Stored securely - never used to access data directly
export const generateRefreshToken = (user: UserPayload): string => {
  return jwt.sign(
    { id: user.id, email: user.email, name: user.name },
    getRefreshSecret(),
    {
      expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "7d",
    } as SignOptions,
  );
};

// Verify an Access Token - returns user info if valid, throws error if not
export const verifyAccessToken = (token: string): UserPayload => {
  return jwt.verify(token, getAccessSecret()) as UserPayload;
};

// Verify a Refresh Token - same idea but for refresh tokens
export const verifyRefreshToken = (token: string): UserPayload => {
  return jwt.verify(token, getRefreshSecret()) as UserPayload;
};
