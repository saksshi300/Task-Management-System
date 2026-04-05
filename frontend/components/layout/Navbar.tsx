"use client";
import Link from "next/link";
import { useAuth } from "../../hooks/useAuth";

export default function Navbar() {
  const { user, logout, isLoggedIn } = useAuth();

  return (
    <nav
      className="navbar navbar-expand-lg navbar-dark"
      style={{
        background:
          "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
      }}
    >
      <div className="container">
        {/* Brand */}
        <Link
          className="navbar-brand fw-bold fs-4 d-flex align-items-center gap-2"
          href={isLoggedIn ? "/dashboard" : "/"}
        >
          <span style={{ fontSize: "1.5rem" }}>✅</span>
          <span style={{ letterSpacing: "1px" }}>
            Task<span style={{ color: "#e94560" }}>Flow</span>
          </span>
        </Link>

        <button
          className="navbar-toggler border-0"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto align-items-center gap-2">
            {isLoggedIn ? (
              <>
                <li className="nav-item">
                  <span className="nav-link text-white-50 d-flex align-items-center gap-1">
                    <span>👋</span>
                    <span>
                      Hi,{" "}
                      <strong className="text-white">
                        {user?.name?.split(" ")[0]}
                      </strong>
                    </span>
                  </span>
                </li>
                <li className="nav-item">
                  <Link className="nav-link text-white" href="/dashboard">
                    📋 Dashboard
                  </Link>
                </li>
                <li className="nav-item">
                  <button
                    className="btn btn-sm btn-outline-danger px-3"
                    onClick={logout}
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link className="nav-link text-white" href="/login">
                    Login
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    className="btn btn-sm px-3 text-white"
                    href="/register"
                    style={{ background: "#e94560", border: "none" }}
                  >
                    Get Started
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}
