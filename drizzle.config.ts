import type { Config } from "drizzle-kit";
import "dotenv/config";

export default {
  schema: "./src/server/schema/auth.ts",
  out: "./migrations",
  driver: "libsql", // 'pg' | 'mysql2' | 'better-sqlite' | 'libsql' | 'turso'
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
} satisfies Config;
