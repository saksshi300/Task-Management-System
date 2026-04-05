import type { Metadata } from "next";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";
import "./globals.css";
import BootstrapClient from "../../components/layout/BootstrapClient";
import ToastProvider from "../../components/layout/ToastProvider";

export const metadata: Metadata = {
  title: "TaskFlow – Manage Your Tasks",
  description:
    "A modern task management application built with Next.js and Node.js",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
        <ToastProvider />
        <BootstrapClient />
      </body>
    </html>
  );
}
