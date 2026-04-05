// ============================================================
// TASK ROUTES
// All routes here require authentication (protect everything!)
// ============================================================

import { Router } from "express";
import { body, param } from "express-validator";
import {
  getTasks,
  createTask,
  getTask,
  updateTask,
  deleteTask,
  toggleTask,
} from "../controllers/task.controller";
import { authenticate } from "../middleware/auth.middleware";
import { validate } from "../middleware/validate.middleware";

const router = Router();

// ─── Apply authentication to ALL task routes ────────────────
// Every request to /tasks/... must have a valid access token
router.use(authenticate);

// ─── Validation Rules ───────────────────────────────────────

const createTaskValidation = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Task title is required.")
    .isLength({ max: 200 })
    .withMessage("Title cannot exceed 200 characters."),
  body("description")
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage("Description cannot exceed 1000 characters."),
  body("status")
    .optional()
    .isIn(["PENDING", "IN_PROGRESS", "COMPLETED"])
    .withMessage("Status must be PENDING, IN_PROGRESS, or COMPLETED."),
  body("priority")
    .optional()
    .isIn(["LOW", "MEDIUM", "HIGH"])
    .withMessage("Priority must be LOW, MEDIUM, or HIGH."),
  body("dueDate")
    .optional()
    .isISO8601()
    .withMessage("Due date must be a valid date."),
];

const updateTaskValidation = [
  param("id").isInt({ min: 1 }).withMessage("Invalid task ID."),
  body("title")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Title cannot be empty.")
    .isLength({ max: 200 })
    .withMessage("Title cannot exceed 200 characters."),
  body("description")
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage("Description cannot exceed 1000 characters."),
  body("status")
    .optional()
    .isIn(["PENDING", "IN_PROGRESS", "COMPLETED"])
    .withMessage("Invalid status."),
  body("priority")
    .optional()
    .isIn(["LOW", "MEDIUM", "HIGH"])
    .withMessage("Invalid priority."),
  body("dueDate")
    .optional()
    .isISO8601()
    .withMessage("Due date must be a valid date."),
];

const idValidation = [
  param("id").isInt({ min: 1 }).withMessage("Invalid task ID."),
];

// ─── Route Definitions ──────────────────────────────────────

// GET  /tasks        → get all tasks (with pagination, filter, search)
// POST /tasks        → create a new task
router
  .route("/")
  .get(getTasks)
  .post(createTaskValidation, validate, createTask);

// GET    /tasks/:id  → get one task
// PATCH  /tasks/:id  → update task (partial)
// DELETE /tasks/:id  → delete task
router
  .route("/:id")
  .get(idValidation, validate, getTask)
  .patch(updateTaskValidation, validate, updateTask)
  .delete(idValidation, validate, deleteTask);

// PATCH /tasks/:id/toggle → cycle task status
router.patch("/:id/toggle", idValidation, validate, toggleTask);

export default router;
