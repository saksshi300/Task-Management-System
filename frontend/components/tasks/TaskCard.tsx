"use client";
import { Task } from "../../types";
import { StatusBadge, PriorityBadge } from "../ui/StatusBadge";

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: number) => void;
  onToggle: (id: number) => void;
}

export default function TaskCard({
  task,
  onEdit,
  onDelete,
  onToggle,
}: TaskCardProps) {
  const isCompleted = task.status === "COMPLETED";
  const isOverdue =
    task.dueDate && new Date(task.dueDate) < new Date() && !isCompleted;

  return (
    <div
      className={`card h-100 border-0 shadow-sm task-card ${isCompleted ? "opacity-75" : ""}`}
      style={{
        borderRadius: "12px",
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
        borderLeft: `4px solid ${task.priority === "HIGH" ? "#dc3545" : task.priority === "MEDIUM" ? "#ffc107" : "#198754"} !important`,
      }}
    >
      <div className="card-body p-4">
        {/* Header: Status & Priority */}
        <div className="d-flex justify-content-between align-items-start mb-3">
          <StatusBadge status={task.status} />
          <PriorityBadge priority={task.priority} />
        </div>

        {/* Title */}
        <h5
          className="card-title fw-semibold mb-2"
          style={{
            textDecoration: isCompleted ? "line-through" : "none",
            color: isCompleted ? "#6c757d" : "#1a1a2e",
            fontSize: "1rem",
          }}
        >
          {task.title}
        </h5>

        {/* Description */}
        {task.description && (
          <p
            className="card-text text-muted small mb-3"
            style={{
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {task.description}
          </p>
        )}

        {/* Due Date */}
        {task.dueDate && (
          <div
            className={`small mb-3 d-flex align-items-center gap-1 ${isOverdue ? "text-danger fw-semibold" : "text-muted"}`}
          >
            <span>{isOverdue ? "⚠️" : "📅"}</span>
            <span>{isOverdue ? "Overdue: " : "Due: "}</span>
            <span>
              {new Date(task.dueDate).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </span>
          </div>
        )}

        {/* Footer: Created date */}
        <div className="text-muted" style={{ fontSize: "0.75rem" }}>
          Created{" "}
          {new Date(task.createdAt).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
          })}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="card-footer bg-transparent border-0 pt-0 pb-3 px-4">
        <div className="d-flex gap-2">
          {/* Toggle Status */}
          <button
            className="btn btn-sm btn-outline-secondary flex-fill"
            onClick={() => onToggle(task.id)}
            title="Toggle status"
            style={{ fontSize: "0.8rem" }}
          >
            {task.status === "PENDING"
              ? "▶ Start"
              : task.status === "IN_PROGRESS"
                ? "✔ Complete"
                : "↩ Reopen"}
          </button>

          {/* Edit */}
          <button
            className="btn btn-sm btn-outline-primary"
            onClick={() => onEdit(task)}
            title="Edit task"
          >
            ✏️
          </button>

          {/* Delete */}
          <button
            className="btn btn-sm btn-outline-danger"
            onClick={() => {
              if (confirm(`Delete "${task.title}"? This cannot be undone.`)) {
                onDelete(task.id);
              }
            }}
            title="Delete task"
          >
            🗑️
          </button>
        </div>
      </div>
    </div>
  );
}
