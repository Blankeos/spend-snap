import type { Config } from "drizzle-kit";
import "dotenv/config";

export default {
  schema: "./src/server/schema",
  out: "./migrations",
  driver: "turso", // 'pg' | 'mysql2' | 'better-sqlite' | 'libsql' | 'turso'
  dbCredentials: {
    url: process.env.DATABASE_URL!,
    authToken: process.env.DATABASE_AUTH_TOKEN!,
  },
  dialect: "sqlite",
} satisfies Config;
