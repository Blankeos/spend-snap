import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const userTable = sqliteTable("user", {
  id: text("id").notNull().primaryKey(),
  username: text("username").notNull(),
  passwordHash: text("password_hash").notNull(),
  createdTimestamp: text("created_timestamp").default(sql`(CURRENT_TIMESTAMP)`),
  updatedTimestamp: text("updated_timestamp").default(sql`(CURRENT_TIMESTAMP)`),
});

export const sessionTable = sqliteTable("session", {
  id: text("id").notNull().primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => userTable.id),
  expiresAt: integer("expires_at").notNull(),
});
