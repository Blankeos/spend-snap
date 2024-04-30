import "dotenv/config";
import type { Config } from "drizzle-kit";
import { config } from "@/config";

export default {
  schema: "./src/server/schema",
  out: "./drizzle",
  driver: "libsql", // 'pg' | 'mysql2' | 'better-sqlite' | 'libsql' | 'turso'
  dbCredentials: {
    url: config.database.url,
  },
} satisfies Config;
