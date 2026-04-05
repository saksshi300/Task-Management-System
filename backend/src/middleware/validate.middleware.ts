// ============================================================
// VALIDATION MIDDLEWARE
// Checks that incoming data is correct BEFORE processing it
// Like a form validator - catches bad data early
// ============================================================

import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import { sendError } from "../utils/response";

export const validate = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  // Check if express-validator found any errors
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    // Send back a clear list of what's wrong (400 = Bad Request)
    sendError(
      res,
      "Validation failed. Please check your input.",
      400,
      errors.array(),
    );
    return;
  }

  // ✅ No errors - continue to the actual controller
  next();
};
