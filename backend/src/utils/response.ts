// ============================================================
// RESPONSE HELPER FUNCTIONS
// These make sure all our API responses look the same
// Consistency makes it easier for the frontend to handle them
// ============================================================

import { Response } from "express";
import { ApiResponse } from "../types";

// Send a success response (200, 201, etc.)
export const sendSuccess = <T>(
  res: Response,
  message: string,
  data?: T,
  statusCode: number = 200,
): void => {
  const response: ApiResponse<T> = {
    success: true,
    message,
    data,
  };
  res.status(statusCode).json(response);
};

// Send an error response (400, 401, 404, 500, etc.)
export const sendError = (
  res: Response,
  message: string,
  statusCode: number = 500,
  errors?: unknown[],
): void => {
  const response: ApiResponse = {
    success: false,
    message,
    errors,
  };
  res.status(statusCode).json(response);
};
