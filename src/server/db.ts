import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import { privateConfig } from "@/config.private";

// Schemas
import * as authSchema from "./schema/auth";
import * as collationsSchema from "./schema/collations";

const schema = { ...authSchema, ...collationsSchema }; // add the other schemas here later.

// LibSQL client for Sqlite.
export const client = createClient({
  url: privateConfig.database.URL,
  authToken: privateConfig.database.AUTH_TOKEN,
});

/** DrizzleORM client for LibSQL client. */
export const db = drizzle(client, { schema });
