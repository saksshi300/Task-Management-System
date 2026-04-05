// ============================================================
// AUTHENTICATION MIDDLEWARE
// This is a "checkpoint" that runs BEFORE protected routes
// Think of it as a security guard at a club entrance
// It checks your ID (JWT token) before letting you in
// ============================================================

import { Response, NextFunction } from "express";
import { verifyAccessToken } from "../utils/jwt";
import { sendError } from "../utils/response";
import { AuthRequest } from "../types";

export const authenticate = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): void => {
  try {
    // Look for the token in the "Authorization" header
    // Frontend sends it as: "Bearer eyJhbGciOiJIUzI1NiIs..."
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      sendError(res, "Access token required. Please log in.", 401);
      return;
    }

    // Extract just the token (remove "Bearer " prefix)
    const token = authHeader.split(" ")[1];

    // Verify the token is valid and not expired
    const decoded = verifyAccessToken(token);

    // Attach user info to the request so controllers can use it
    req.user = decoded;

    // ✅ Token is valid - let the request continue
    next();
  } catch {
    // Token is invalid or expired
    sendError(
      res,
      "Invalid or expired access token. Please log in again.",
      401,
    );
  }
};
