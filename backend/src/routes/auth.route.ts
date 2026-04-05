// ============================================================
// AUTH ROUTES
// Routes = URL paths that map to controller functions
// Think of routes as a "menu" of what your API can do
// ============================================================

import { Router } from "express";
import { body } from "express-validator";
import {
  register,
  login,
  refresh,
  logout,
  getMe,
} from "../controllers/auth.controller";
import { authenticate } from "../middleware/auth.middleware";
import { validate } from "../middleware/validate.middleware";

const router = Router();

// ─── Validation Rules ───────────────────────────────────────
// These run BEFORE the controller - they check the input first

const registerValidation = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required.")
    .isLength({ min: 2, max: 50 })
    .withMessage("Name must be 2-50 characters."),
  body("email")
    .trim()
    .isEmail()
    .withMessage("Please enter a valid email address.")
    .normalizeEmail(),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters."),
];

const loginValidation = [
  body("email")
    .trim()
    .isEmail()
    .withMessage("Please enter a valid email address.")
    .normalizeEmail(),
  body("password").notEmpty().withMessage("Password is required."),
];

const refreshValidation = [
  body("refreshToken").notEmpty().withMessage("Refresh token is required."),
];

// ─── Route Definitions ──────────────────────────────────────
// Format: router.METHOD('/path', ...middlewares, controller)

// POST /auth/register → validate input → create account
router.post("/register", registerValidation, validate, register);

// POST /auth/login → validate input → check credentials → issue tokens
router.post("/login", loginValidation, validate, login);

// POST /auth/refresh → validate input → issue new access token
router.post("/refresh", refreshValidation, validate, refresh);

// POST /auth/logout → authenticate (must be logged in) → clear token
router.post("/logout", authenticate, logout);

// GET /auth/me → authenticate → return user profile
router.get("/me", authenticate, getMe);

export default router;
