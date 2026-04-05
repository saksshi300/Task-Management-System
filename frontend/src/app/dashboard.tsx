"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { isAuthenticated, getStoredUser } from "../../lib/auth";
import { useTasks } from "../../hooks/useTask";
import { useAuth } from "../../hooks/useAuth";
import { Task, TaskFormData } from "../../types";
import Navbar from "../../components/layout/Navbar";
import TaskCard from "../../components/tasks/TaskCard";
import TaskModal from "../../components/tasks/TaskModal";
import TaskFiltersBar from "../../components/tasks/TaskFilters";
import Pagination from "../../components/tasks/Pagination";

export default function DashboardPage() {
  const router = useRouter();
  const { logout } = useAuth();
  const user = getStoredUser();

  const {
    tasks,
    meta,
    loading,
    loadTasks,
    addTask,
    editTask,
    removeTask,
    toggle,
    applyFilters,
    changePage,
  } = useTasks();

  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // Guard: redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/login");
      return;
    }
    loadTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleOpenCreate = () => {
    setEditingTask(null);
    setShowModal(true);
  };

  const handleOpenEdit = (task: Task) => {
    setEditingTask(task);
    setShowModal(true);
  };

  const handleModalSubmit = async (data: TaskFormData): Promise<boolean> => {
    if (editingTask) {
      return await editTask(editingTask.id, data);
    }
    return await addTask(data);
  };

  // Stats summary
  const pendingCount = tasks.filter((t) => t.status === "PENDING").length;
  const inProgressCount = tasks.filter(
    (t) => t.status === "IN_PROGRESS",
  ).length;
  const completedCount = tasks.filter((t) => t.status === "COMPLETED").length;

  return (
    <>
      <Navbar />

      <div className="container py-4 fade-in-up">
        {/* ── Page Header ─────────────────────────────── */}
        <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3">
          <div>
            <h1 className="h3 fw-bold mb-1" style={{ color: "#1a1a2e" }}>
              My Tasks 📋
            </h1>
            <p className="text-muted mb-0">
              Hello, <strong>{user?.name?.split(" ")[0]}</strong>! Here is your
              work overview.
            </p>
          </div>
          <button
            className="btn fw-semibold text-white px-4 py-2"
            style={{
              background: "linear-gradient(135deg, #0f3460, #e94560)",
              border: "none",
              borderRadius: "10px",
            }}
            onClick={handleOpenCreate}
          >
            + New Task
          </button>
        </div>

        {/* ── Stats Cards ─────────────────────────────── */}
        <div className="row g-3 mb-4">
          {[
            {
              label: "Total Tasks",
              value: meta?.total ?? tasks.length,
              icon: "📋",
              color: "#0f3460",
              bg: "#e8f0fe",
            },
            {
              label: "Pending",
              value: pendingCount,
              icon: "⏳",
              color: "#856404",
              bg: "#fff3cd",
            },
            {
              label: "In Progress",
              value: inProgressCount,
              icon: "🔄",
              color: "#055160",
              bg: "#cff4fc",
            },
            {
              label: "Completed",
              value: completedCount,
              icon: "✅",
              color: "#0f5132",
              bg: "#d1e7dd",
            },
          ].map((stat) => (
            <div key={stat.label} className="col-6 col-lg-3">
              <div
                className="card stat-card shadow-sm p-3"
                style={{ background: stat.bg }}
              >
                <div className="d-flex align-items-center gap-3">
                  <span style={{ fontSize: "1.75rem" }}>{stat.icon}</span>
                  <div>
                    <div
                      className="fw-bold fs-4"
                      style={{ color: stat.color, lineHeight: 1 }}
                    >
                      {stat.value}
                    </div>
                    <div
                      className="small"
                      style={{ color: stat.color, opacity: 0.8 }}
                    >
                      {stat.label}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ── Filters ─────────────────────────────────── */}
        <TaskFiltersBar
          onFilter={applyFilters}
          totalTasks={meta?.total ?? tasks.length}
        />

        {/* ── Task Grid ───────────────────────────────── */}
        {loading ? (
          // Loading skeleton
          <div className="tasks-grid">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="card border-0 shadow-sm p-4"
                style={{ borderRadius: "12px" }}
              >
                <div className="placeholder-glow">
                  <span className="placeholder col-4 mb-3 rounded"></span>
                  <span className="placeholder col-8 mb-2 rounded"></span>
                  <span className="placeholder col-6 rounded"></span>
                </div>
              </div>
            ))}
          </div>
        ) : tasks.length === 0 ? (
          // Empty state
          <div
            className="card border-0 shadow-sm"
            style={{ borderRadius: "16px" }}
          >
            <div className="empty-state">
              <span className="icon">📭</span>
              <h4 className="fw-bold text-dark mb-2">No tasks found</h4>
              <p className="text-muted mb-4">
                {meta?.total === 0
                  ? "You haven't created any tasks yet. Start by adding your first task!"
                  : "No tasks match your current filters. Try clearing them."}
              </p>
              <button
                className="btn fw-semibold text-white px-4"
                style={{
                  background: "linear-gradient(135deg, #0f3460, #e94560)",
                  border: "none",
                  borderRadius: "10px",
                }}
                onClick={handleOpenCreate}
              >
                + Create Your First Task
              </button>
            </div>
          </div>
        ) : (
          // Task cards
          <>
            <div className="tasks-grid">
              {tasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onEdit={handleOpenEdit}
                  onDelete={removeTask}
                  onToggle={toggle}
                />
              ))}
            </div>

            {/* Pagination */}
            {meta && <Pagination meta={meta} onPageChange={changePage} />}
          </>
        )}
      </div>

      {/* Task Create/Edit Modal */}
      <TaskModal
        show={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingTask(null);
        }}
        onSubmit={handleModalSubmit}
        editingTask={editingTask}
      />
    </>
  );
}
