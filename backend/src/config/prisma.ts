// ============================================================
// PRISMA CLIENT CONFIGURATION
// Prisma is our database helper - it lets us talk to SQLite
// using TypeScript code instead of raw SQL queries
// ============================================================

import { PrismaClient } from "@prisma/client";

// Create a single shared Prisma instance
// (We only want one database connection open at a time)
const prisma = new PrismaClient({
  log:
    process.env.NODE_ENV === "development"
      ? ["query", "error", "warn"]
      : ["error"],
});

export default prisma;
