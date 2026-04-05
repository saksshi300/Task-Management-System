"use client";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Task, TaskFormData } from "../../types";

interface TaskModalProps {
  show: boolean;
  onClose: () => void;
  onSubmit: (data: TaskFormData) => Promise<boolean>;
  editingTask?: Task | null;
}

export default function TaskModal({
  show,
  onClose,
  onSubmit,
  editingTask,
}: TaskModalProps) {
  const isEditing = !!editingTask;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TaskFormData>({
    defaultValues: {
      title: "",
      description: "",
      status: "PENDING",
      priority: "MEDIUM",
      dueDate: "",
    },
  });

  // Populate form when editing
  useEffect(() => {
    if (editingTask) {
      reset({
        title: editingTask.title,
        description: editingTask.description || "",
        status: editingTask.status,
        priority: editingTask.priority,
        dueDate: editingTask.dueDate
          ? new Date(editingTask.dueDate).toISOString().split("T")[0]
          : "",
      });
    } else {
      reset({
        title: "",
        description: "",
        status: "PENDING",
        priority: "MEDIUM",
        dueDate: "",
      });
    }
  }, [editingTask, reset]);

  const handleFormSubmit = async (data: TaskFormData) => {
    const success = await onSubmit(data);
    if (success) {
      reset();
      onClose();
    }
  };

  if (!show) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="modal-backdrop fade show"
        style={{ zIndex: 1040 }}
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className="modal fade show d-block"
        style={{ zIndex: 1050 }}
        role="dialog"
      >
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div
            className="modal-content border-0 shadow-lg"
            style={{ borderRadius: "16px" }}
          >
            {/* Header */}
            <div
              className="modal-header border-0 text-white px-4 pt-4 pb-3"
              style={{
                background: "linear-gradient(135deg, #1a1a2e, #0f3460)",
                borderRadius: "16px 16px 0 0",
              }}
            >
              <h5 className="modal-title fw-bold">
                {isEditing ? "✏️ Edit Task" : "➕ Create New Task"}
              </h5>
              <button
                type="button"
                className="btn-close btn-close-white"
                onClick={onClose}
              />
            </div>

            {/* Body */}
            <form onSubmit={handleSubmit(handleFormSubmit)}>
              <div className="modal-body px-4 py-4">
                <div className="row g-3">
                  {/* Title */}
                  <div className="col-12">
                    <label className="form-label fw-semibold text-dark">
                      Task Title <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className={`form-control form-control-lg ${errors.title ? "is-invalid" : ""}`}
                      placeholder="What needs to be done?"
                      style={{
                        borderRadius: "10px",
                        border: "1.5px solid #dee2e6",
                      }}
                      {...register("title", {
                        required: "Title is required.",
                        maxLength: {
                          value: 200,
                          message: "Title is too long.",
                        },
                      })}
                    />
                    {errors.title && (
                      <div className="invalid-feedback">
                        {errors.title.message}
                      </div>
                    )}
                  </div>

                  {/* Description */}
                  <div className="col-12">
                    <label className="form-label fw-semibold text-dark">
                      Description
                    </label>
                    <textarea
                      className="form-control"
                      placeholder="Add more details about this task..."
                      rows={3}
                      style={{
                        borderRadius: "10px",
                        border: "1.5px solid #dee2e6",
                        resize: "none",
                      }}
                      {...register("description")}
                    />
                  </div>

                  {/* Status */}
                  <div className="col-md-4">
                    <label className="form-label fw-semibold text-dark">
                      Status
                    </label>
                    <select
                      className="form-select"
                      style={{
                        borderRadius: "10px",
                        border: "1.5px solid #dee2e6",
                      }}
                      {...register("status")}
                    >
                      <option value="PENDING">⏳ Pending</option>
                      <option value="IN_PROGRESS">🔄 In Progress</option>
                      <option value="COMPLETED">✅ Completed</option>
                    </select>
                  </div>

                  {/* Priority */}
                  <div className="col-md-4">
                    <label className="form-label fw-semibold text-dark">
                      Priority
                    </label>
                    <select
                      className="form-select"
                      style={{
                        borderRadius: "10px",
                        border: "1.5px solid #dee2e6",
                      }}
                      {...register("priority")}
                    >
                      <option value="LOW">🟢 Low</option>
                      <option value="MEDIUM">🟡 Medium</option>
                      <option value="HIGH">🔴 High</option>
                    </select>
                  </div>

                  {/* Due Date */}
                  <div className="col-md-4">
                    <label className="form-label fw-semibold text-dark">
                      Due Date
                    </label>
                    <input
                      type="date"
                      className="form-control"
                      style={{
                        borderRadius: "10px",
                        border: "1.5px solid #dee2e6",
                      }}
                      {...register("dueDate")}
                    />
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="modal-footer border-0 px-4 pb-4">
                <button
                  type="button"
                  className="btn btn-light px-4"
                  onClick={onClose}
                  style={{ borderRadius: "10px" }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn text-white px-5 fw-semibold"
                  disabled={isSubmitting}
                  style={{
                    background: "linear-gradient(135deg, #0f3460, #e94560)",
                    border: "none",
                    borderRadius: "10px",
                  }}
                >
                  {isSubmitting ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" />{" "}
                      Saving...
                    </>
                  ) : isEditing ? (
                    "Save Changes"
                  ) : (
                    "Create Task"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
