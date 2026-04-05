"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { registerUser } from "../../lib/auth";
import { toast } from "react-toastify";

interface RegisterForm {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export default function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RegisterForm>();

  const password = watch("password");

  const onSubmit = async (data: RegisterForm) => {
    try {
      await registerUser(data.name, data.email, data.password);
      toast.success("Account created! Welcome to TaskFlow 🎉");
      router.push("/dashboard");
    } catch (err: unknown) {
      const error = err as {
        response?: { data?: { message?: string; errors?: { msg: string }[] } };
      };
      const backendErrors = error?.response?.data?.errors;
      if (backendErrors && backendErrors.length > 0) {
        backendErrors.forEach((e: { msg: string }) => toast.error(e.msg));
      } else {
        const msg =
          error?.response?.data?.message ||
          "Registration failed. Please try again.";
        toast.error(msg);
      }
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card fade-in-up">
        <div className="text-center mb-4">
          <div style={{ fontSize: "2.5rem" }}>✅</div>
          <h2 className="fw-bold mt-2" style={{ color: "#1a1a2e" }}>
            Task<span style={{ color: "#e94560" }}>Flow</span>
          </h2>
          <p className="text-muted small">
            Create your free account to get started.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="mb-3">
            <label className="form-label fw-semibold text-dark">
              Full Name
            </label>
            <input
              type="text"
              className={`form-control form-control-lg ${errors.name ? "is-invalid" : ""}`}
              placeholder="Rahul Sharma"
              style={{ borderRadius: "10px" }}
              {...register("name", {
                required: "Name is required.",
                minLength: {
                  value: 2,
                  message: "Name must be at least 2 characters.",
                },
              })}
            />
            {errors.name && (
              <div className="invalid-feedback">{errors.name.message}</div>
            )}
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold text-dark">
              Email Address
            </label>
            <input
              type="email"
              className={`form-control form-control-lg ${errors.email ? "is-invalid" : ""}`}
              placeholder="you@example.com"
              style={{ borderRadius: "10px" }}
              {...register("email", {
                required: "Email is required.",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Enter a valid email.",
                },
              })}
            />
            {errors.email && (
              <div className="invalid-feedback">{errors.email.message}</div>
            )}
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold text-dark">Password</label>
            <div className="input-group">
              <input
                type={showPassword ? "text" : "password"}
                className={`form-control form-control-lg ${errors.password ? "is-invalid" : ""}`}
                placeholder="Minimum 6 characters"
                style={{ borderRadius: "10px 0 0 10px" }}
                {...register("password", {
                  required: "Password is required.",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters.",
                  },
                })}
              />
              <button
                type="button"
                className="btn btn-outline-secondary"
                style={{ borderRadius: "0 10px 10px 0" }}
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
              {errors.password && (
                <div className="invalid-feedback">
                  {errors.password.message}
                </div>
              )}
            </div>
          </div>

          <div className="mb-4">
            <label className="form-label fw-semibold text-dark">
              Confirm Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              className={`form-control form-control-lg ${errors.confirmPassword ? "is-invalid" : ""}`}
              placeholder="Repeat your password"
              style={{ borderRadius: "10px" }}
              {...register("confirmPassword", {
                required: "Please confirm your password.",
                validate: (value) =>
                  value === password || "Passwords do not match.",
              })}
            />
            {errors.confirmPassword && (
              <div className="invalid-feedback">
                {errors.confirmPassword.message}
              </div>
            )}
          </div>

          <button
            type="submit"
            className="btn btn-primary-custom"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" />
                Creating account...
              </>
            ) : (
              "Create Account →"
            )}
          </button>
        </form>

        <hr className="my-4" />
        <p className="text-center text-muted mb-0">
          Already have an account?{" "}
          <Link
            href="/login"
            className="fw-semibold text-decoration-none"
            style={{ color: "#e94560" }}
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
