import { migrate } from "drizzle-orm/libsql/migrator";
import { db, client } from "@/server/db";

async function migrateUp() {
  try {
    const result = await client.execute("SELECT 1");
    console.log("Connected to the database successfully.");

    await migrate(db, { migrationsFolder: "./migrations" });

    console.log("Database migrated successfully.");
  } catch (err) {
    console.log("Failed to connect.");
  }
}

migrateUp();
