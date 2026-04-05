"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { loginUser } from "../../lib/auth";
import { toast } from "react-toastify";

interface LoginForm {
  email: string;
  password: string;
}

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>();

  const onSubmit = async (data: LoginForm) => {
    try {
      await loginUser(data.email, data.password);
      toast.success("Welcome back! 👋");
      router.push("/dashboard");
    } catch (err: unknown) {
      const error = err as {
        response?: { data?: { message?: string; errors?: { msg: string }[] } };
      };
      // Show validation errors from backend if present
      const backendErrors = error?.response?.data?.errors;
      if (backendErrors && backendErrors.length > 0) {
        backendErrors.forEach((e: { msg: string }) => toast.error(e.msg));
      } else {
        const msg =
          error?.response?.data?.message ||
          "Login failed. Please check your email and password.";
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
          <p className="text-muted small">Welcome back! Sign in to continue.</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
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

          <div className="mb-4">
            <label className="form-label fw-semibold text-dark">Password</label>
            <div className="input-group">
              <input
                type={showPassword ? "text" : "password"}
                className={`form-control form-control-lg ${errors.password ? "is-invalid" : ""}`}
                placeholder="Your password"
                style={{ borderRadius: "10px 0 0 10px" }}
                {...register("password", { required: "Password is required." })}
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

          <button
            type="submit"
            className="btn btn-primary-custom"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" />
                Signing in...
              </>
            ) : (
              "Sign In →"
            )}
          </button>
        </form>

        <hr className="my-4" />
        <p className="text-center text-muted mb-0">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="fw-semibold text-decoration-none"
            style={{ color: "#e94560" }}
          >
            Create one free
          </Link>
        </p>
      </div>
    </div>
  );
}
