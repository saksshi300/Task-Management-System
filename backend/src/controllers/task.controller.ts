import { Response } from "express";
import prisma from "../config/prisma";
import { sendSuccess, sendError } from "../utils/response";
import { AuthRequest, TaskQuery, PaginationMeta } from "../types";

// GET /tasks
export const getTasks = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const {
      page = "1",
      limit = "10",
      status,
      search,
      priority,
    } = req.query as TaskQuery;
    const userId = req.user!.id;

    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(50, Math.max(1, parseInt(limit)));
    const skip = (pageNum - 1) * limitNum;

    // Build filter dynamically
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = { userId };
    if (status) where.status = status;
    if (priority) where.priority = priority;
    if (search) where.title = { contains: search };

    const [tasks, total] = await Promise.all([
      prisma.task.findMany({
        where,
        skip,
        take: limitNum,
        orderBy: { createdAt: "desc" },
      }),
      prisma.task.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limitNum);
    const meta: PaginationMeta = {
      total,
      page: pageNum,
      limit: limitNum,
      totalPages,
      hasNextPage: pageNum < totalPages,
      hasPrevPage: pageNum > 1,
    };

    sendSuccess(res, "Tasks fetched successfully.", { tasks, meta });
  } catch (error) {
    console.error("Get tasks error:", error);
    sendError(res, "Failed to fetch tasks.", 500);
  }
};

// POST /tasks
export const createTask = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const { title, description, status, priority, dueDate } = req.body;
    const userId = req.user!.id;

    const task = await prisma.task.create({
      data: {
        title,
        description: description || null,
        status: status || "PENDING",
        priority: priority || "MEDIUM",
        dueDate: dueDate ? new Date(dueDate) : null,
        userId,
      },
    });

    sendSuccess(res, "Task created successfully!", { task }, 201);
  } catch (error) {
    console.error("Create task error:", error);
    sendError(res, "Failed to create task.", 500);
  }
};

// GET /tasks/:id
export const getTask = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const taskId = parseInt(req.params.id as string);
    const userId = req.user!.id;

    const task = await prisma.task.findUnique({ where: { id: taskId } });

    if (!task) {
      sendError(res, "Task not found.", 404);
      return;
    }
    if (task.userId !== userId) {
      sendError(res, "You do not have permission to view this task.", 403);
      return;
    }

    sendSuccess(res, "Task fetched successfully.", { task });
  } catch (error) {
    console.error("Get task error:", error);
    sendError(res, "Failed to fetch task.", 500);
  }
};

// PATCH /tasks/:id
export const updateTask = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const taskId = parseInt(req.params.id as string);
    const userId = req.user!.id;
    const { title, description, status, priority, dueDate } = req.body;

    const existingTask = await prisma.task.findUnique({
      where: { id: taskId },
    });
    if (!existingTask) {
      sendError(res, "Task not found.", 404);
      return;
    }
    if (existingTask.userId !== userId) {
      sendError(res, "You do not have permission to update this task.", 403);
      return;
    }

    // Only update fields that were provided
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updateData: any = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (status !== undefined) updateData.status = status;
    if (priority !== undefined) updateData.priority = priority;
    if (dueDate !== undefined)
      updateData.dueDate = dueDate ? new Date(dueDate) : null;

    const task = await prisma.task.update({
      where: { id: taskId },
      data: updateData,
    });

    sendSuccess(res, "Task updated successfully!", { task });
  } catch (error) {
    console.error("Update task error:", error);
    sendError(res, "Failed to update task.", 500);
  }
};

// DELETE /tasks/:id
export const deleteTask = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const taskId = parseInt(req.params.id as string);
    const userId = req.user!.id;

    const existingTask = await prisma.task.findUnique({
      where: { id: taskId },
    });
    if (!existingTask) {
      sendError(res, "Task not found.", 404);
      return;
    }
    if (existingTask.userId !== userId) {
      sendError(res, "You do not have permission to delete this task.", 403);
      return;
    }

    await prisma.task.delete({ where: { id: taskId } });
    sendSuccess(res, "Task deleted successfully!");
  } catch (error) {
    console.error("Delete task error:", error);
    sendError(res, "Failed to delete task.", 500);
  }
};

// PATCH /tasks/:id/toggle
export const toggleTask = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const taskId = parseInt(req.params.id as string);
    const userId = req.user!.id;

    const existingTask = await prisma.task.findUnique({
      where: { id: taskId },
    });
    if (!existingTask) {
      sendError(res, "Task not found.", 404);
      return;
    }
    if (existingTask.userId !== userId) {
      sendError(res, "You do not have permission to update this task.", 403);
      return;
    }

    const statusCycle: Record<string, string> = {
      PENDING: "IN_PROGRESS",
      IN_PROGRESS: "COMPLETED",
      COMPLETED: "PENDING",
    };

    const newStatus = statusCycle[existingTask.status] || "PENDING";

    const task = await prisma.task.update({
      where: { id: taskId },
      data: { status: newStatus },
    });

    sendSuccess(
      res,
      `Task marked as ${newStatus.replace("_", " ").toLowerCase()}.`,
      { task },
    );
  } catch (error) {
    console.error("Toggle task error:", error);
    sendError(res, "Failed to toggle task status.", 500);
  }
};
