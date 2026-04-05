"use client";
import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { isAuthenticated } from "../../lib/auth";
import Navbar from "../../components/layout/Navbar";

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated()) router.push("/dashboard");
  }, [router]);

  return (
    <>
      <Navbar />
      <section
        className="text-white py-5"
        style={{
          background:
            "linear-gradient(135deg, #1a1a2e 0%, #16213e 60%, #0f3460 100%)",
          minHeight: "90vh",
          display: "flex",
          alignItems: "center",
        }}
      >
        <div className="container text-center fade-in-up">
          <div className="mb-4" style={{ fontSize: "4rem" }}>
            ✅
          </div>
          <h1 className="display-3 fw-bold mb-4">
            Task<span style={{ color: "#e94560" }}>Flow</span>
          </h1>
          <p
            className="lead mb-2 text-white-50"
            style={{ maxWidth: "560px", margin: "0 auto" }}
          >
            The simple, powerful task manager that keeps your work organized.
          </p>
          <p className="mb-5 text-white-50">
            Track progress. Meet deadlines. Stay focused.
          </p>
          <div className="d-flex gap-3 justify-content-center flex-wrap">
            <Link
              href="/register"
              className="btn btn-lg px-5 py-3 fw-semibold"
              style={{
                background: "#e94560",
                border: "none",
                color: "white",
                borderRadius: "12px",
              }}
            >
              Get Started Free →
            </Link>
            <Link
              href="/login"
              className="btn btn-lg btn-outline-light px-5 py-3 fw-semibold"
              style={{ borderRadius: "12px" }}
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>

      <section className="py-5 bg-white">
        <div className="container">
          <h2 className="text-center fw-bold mb-5" style={{ color: "#1a1a2e" }}>
            Everything you need to stay productive
          </h2>
          <div className="row g-4">
            {[
              {
                icon: "🔐",
                title: "Secure Authentication",
                desc: "JWT-based login with access & refresh tokens. Your data is always protected.",
              },
              {
                icon: "📋",
                title: "Full Task CRUD",
                desc: "Create, edit, delete and toggle tasks instantly. Manage everything in one place.",
              },
              {
                icon: "🔍",
                title: "Search & Filter",
                desc: "Find tasks by title, filter by status or priority, with smooth pagination.",
              },
              {
                icon: "📱",
                title: "Fully Responsive",
                desc: "Works beautifully on desktop, tablet and mobile.",
              },
              {
                icon: "⚡",
                title: "Real-time Feedback",
                desc: "Toast notifications for every action so you always know what happened.",
              },
              {
                icon: "🎯",
                title: "Priority Levels",
                desc: "Mark tasks as Low, Medium, or High priority to focus on what matters most.",
              },
            ].map((f) => (
              <div key={f.title} className="col-12 col-md-6 col-lg-4">
                <div
                  className="card border-0 shadow-sm h-100 p-4"
                  style={{ borderRadius: "16px" }}
                >
                  <div style={{ fontSize: "2rem" }} className="mb-3">
                    {f.icon}
                  </div>
                  <h5 className="fw-bold mb-2">{f.title}</h5>
                  <p className="text-muted mb-0">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        className="py-5 text-white text-center"
        style={{ background: "linear-gradient(135deg, #0f3460, #e94560)" }}
      >
        <div className="container">
          <h2 className="fw-bold mb-3">Ready to get organised?</h2>
          <p className="mb-4" style={{ color: "rgba(255,255,255,0.7)" }}>
            Join TaskFlow today — it is completely free.
          </p>
          <Link
            href="/register"
            className="btn btn-lg btn-light fw-semibold px-5"
            style={{ borderRadius: "12px", color: "#0f3460" }}
          >
            Create Your Account →
          </Link>
        </div>
      </section>

      <footer
        className="py-4 text-center small"
        style={{ background: "#1a1a2e", color: "#6c757d" }}
      >
        <div className="container">
          <span style={{ color: "#6c757d" }}>
            © 2025 TaskFlow · Built with Next.js + Node.js + TypeScript
          </span>
        </div>
      </footer>
    </>
  );
}
