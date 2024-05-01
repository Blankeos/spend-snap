import { migrate } from "drizzle-orm/libsql/migrator";
import { db, client } from "@/server/db";

migrate(db, { migrationsFolder: "./migrations" });

client.close();
