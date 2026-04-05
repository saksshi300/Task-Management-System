"use client";
import { useEffect } from "react";

// Bootstrap JS needs to run on the client (browser), not on the server
// This component loads it safely in Next.js App Router
export default function BootstrapClient() {
  useEffect(() => {
    // Dynamically import Bootstrap JS only in the browser
    import("bootstrap/dist/js/bootstrap.bundle.min.js" as any);
  }, []);

  return null; // This component renders nothing visible
}
