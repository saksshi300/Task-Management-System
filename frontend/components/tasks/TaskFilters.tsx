"use client";
import { useState } from "react";
import { TaskFilters, TaskStatus, TaskPriority } from "../../types";

interface TaskFiltersProps {
  onFilter: (filters: Partial<TaskFilters>) => void;
  totalTasks: number;
}

export default function TaskFiltersBar({
  onFilter,
  totalTasks,
}: TaskFiltersProps) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<TaskStatus | "">("");
  const [priority, setPriority] = useState<TaskPriority | "">("");

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    onFilter({
      search: e.target.value,
      status: status || undefined,
      priority: priority || undefined,
    });
  };

  const handleStatus = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value as TaskStatus | "";
    setStatus(val);
    onFilter({
      search,
      status: val || undefined,
      priority: priority || undefined,
    });
  };

  const handlePriority = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value as TaskPriority | "";
    setPriority(val);
    onFilter({
      search,
      status: status || undefined,
      priority: val || undefined,
    });
  };

  const clearFilters = () => {
    setSearch("");
    setStatus("");
    setPriority("");
    onFilter({ search: "", status: undefined, priority: undefined });
  };

  const hasFilters = search || status || priority;

  return (
    <div
      className="card border-0 shadow-sm mb-4"
      style={{ borderRadius: "12px" }}
    >
      <div className="card-body p-3">
        <div className="row g-3 align-items-center">
          {/* Search */}
          <div className="col-12 col-md-5">
            <div className="input-group">
              <span className="input-group-text bg-white border-end-0">🔍</span>
              <input
                type="text"
                className="form-control border-start-0 ps-0"
                placeholder="Search tasks by title..."
                value={search}
                onChange={handleSearch}
              />
            </div>
          </div>

          {/* Status Filter */}
          <div className="col-6 col-md-3">
            <select
              className="form-select"
              value={status}
              onChange={handleStatus}
            >
              <option value="">All Statuses</option>
              <option value="PENDING">⏳ Pending</option>
              <option value="IN_PROGRESS">🔄 In Progress</option>
              <option value="COMPLETED">✅ Completed</option>
            </select>
          </div>

          {/* Priority Filter */}
          <div className="col-6 col-md-2">
            <select
              className="form-select"
              value={priority}
              onChange={handlePriority}
            >
              <option value="">All Priorities</option>
              <option value="LOW">🟢 Low</option>
              <option value="MEDIUM">🟡 Medium</option>
              <option value="HIGH">🔴 High</option>
            </select>
          </div>

          {/* Clear + Count */}
          <div className="col-12 col-md-2 d-flex align-items-center gap-2">
            {hasFilters && (
              <button
                className="btn btn-sm btn-outline-secondary"
                onClick={clearFilters}
              >
                ✕ Clear
              </button>
            )}
            <span className="text-muted small ms-auto">
              {totalTasks} task{totalTasks !== 1 ? "s" : ""}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
