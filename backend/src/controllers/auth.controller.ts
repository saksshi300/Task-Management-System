import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import prisma from "../config/prisma";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../utils/jwt";
import { sendSuccess, sendError } from "../utils/response";
import { AuthRequest } from "../types";

// POST /auth/register
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      sendError(res, "An account with this email already exists.", 409);
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword },
      select: { id: true, name: true, email: true, createdAt: true },
    });

    const userPayload = { id: user.id, email: user.email, name: user.name };
    const accessToken = generateAccessToken(userPayload);
    const refreshToken = generateRefreshToken(userPayload);

    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken },
    });

    sendSuccess(
      res,
      "Account created successfully!",
      { user, accessToken, refreshToken },
      201,
    );
  } catch (error) {
    console.error("Register error:", error);
    sendError(
      res,
      "Something went wrong during registration. Please try again.",
      500,
    );
  }
};

// POST /auth/login
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      sendError(res, "Invalid email or password.", 401);
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      sendError(res, "Invalid email or password.", 401);
      return;
    }

    const userPayload = { id: user.id, email: user.email, name: user.name };
    const accessToken = generateAccessToken(userPayload);
    const refreshToken = generateRefreshToken(userPayload);

    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken },
    });

    const userData = {
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
    };
    sendSuccess(res, "Logged in successfully!", {
      user: userData,
      accessToken,
      refreshToken,
    });
  } catch (error) {
    console.error("Login error:", error);
    sendError(res, "Something went wrong during login. Please try again.", 500);
  }
};

// POST /auth/refresh
export const refresh = async (req: Request, res: Response): Promise<void> => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      sendError(res, "Refresh token is required.", 401);
      return;
    }

    const decoded = verifyRefreshToken(refreshToken);

    const user = await prisma.user.findUnique({ where: { id: decoded.id } });
    if (!user || user.refreshToken !== refreshToken) {
      sendError(res, "Invalid refresh token. Please log in again.", 401);
      return;
    }

    const userPayload = { id: user.id, email: user.email, name: user.name };
    const newAccessToken = generateAccessToken(userPayload);

    sendSuccess(res, "Access token refreshed successfully.", {
      accessToken: newAccessToken,
    });
  } catch {
    sendError(
      res,
      "Invalid or expired refresh token. Please log in again.",
      401,
    );
  }
};

// POST /auth/logout
export const logout = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    await prisma.user.update({
      where: { id: req.user!.id },
      data: { refreshToken: null },
    });
    sendSuccess(res, "Logged out successfully.");
  } catch (error) {
    console.error("Logout error:", error);
    sendError(res, "Something went wrong during logout.", 500);
  }
};

// GET /auth/me
export const getMe = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      select: { id: true, name: true, email: true, createdAt: true },
    });

    if (!user) {
      sendError(res, "User not found.", 404);
      return;
    }

    sendSuccess(res, "User profile fetched successfully.", { user });
  } catch (error) {
    console.error("Get me error:", error);
    sendError(res, "Something went wrong.", 500);
  }
};
