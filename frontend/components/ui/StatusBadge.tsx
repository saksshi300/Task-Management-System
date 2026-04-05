import { TaskStatus, TaskPriority } from "../../types";

interface StatusBadgeProps {
  status: TaskStatus;
}

interface PriorityBadgeProps {
  priority: TaskPriority;
}

export const StatusBadge = ({ status }: StatusBadgeProps) => {
  const config = {
    PENDING: { label: "⏳ Pending", className: "bg-warning text-dark" },
    IN_PROGRESS: { label: "🔄 In Progress", className: "bg-info text-dark" },
    COMPLETED: { label: "✅ Completed", className: "bg-success" },
  } as const satisfies Record<TaskStatus, { label: string; className: string }>;

  const { label, className } = config[status];
  return (
    <span className={`badge ${className} rounded-pill px-3 py-2`}>{label}</span>
  );
};

export const PriorityBadge = ({ priority }: PriorityBadgeProps) => {
  const config = {
    LOW: { label: "🟢 Low", className: "bg-secondary" },
    MEDIUM: { label: "🟡 Medium", className: "bg-warning text-dark" },
    HIGH: { label: "🔴 High", className: "bg-danger" },
  } as const satisfies Record<
    TaskPriority,
    { label: string; className: string }
  >;

  const { label, className } = config[priority];
  return (
    <span
      className={`badge ${className} rounded-pill px-2 py-1`}
      style={{ fontSize: "0.7rem" }}
    >
      {label}
    </span>
  );
};
