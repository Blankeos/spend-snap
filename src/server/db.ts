import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import { config } from "@/config";
import * as authSchema from "./schema/auth";

const schema = { ...authSchema }; // add the other schemas here later.

// LibSQL client for Sqlite.
export const client = createClient({
  url: config.database.url,
  authToken: config.database.authToken,
});

/** DrizzleORM client for LibSQL client. */
export const db = drizzle(client, { schema });
