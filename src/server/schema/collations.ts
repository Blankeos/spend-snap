import { sqliteTable, text, real } from "drizzle-orm/sqlite-core";
import { userTable } from "./auth";
import { sql } from "drizzle-orm";
import { createId } from "@paralleldrive/cuid2";

/** 1 collation is a group of receipts. This could be for a trip. */
export const collationTable = sqliteTable("collation", {
  id: text("id")
    .notNull()
    .primaryKey()
    .$defaultFn(() => createId()),
  name: text("name").notNull(),
  description: text("description").notNull().default(""),
  totalBudget: real("total_budget").notNull(),

  createdTimestamp: text("created_timestamp").default(sql`(CURRENT_TIMESTAMP)`),
  updatedTimestamp: text("updated_timestamp").default(sql`(CURRENT_TIMESTAMP)`),

  // References:
  createdById: text("created_by_id")
    .notNull()
    .references(() => userTable.id),
});

/** A cached version of some of the values in receiptSegmentedAmountsSpenderTable */
type SegmentedAmountsColumn = Array<{
  amount: number;
  spenderId: string;
  spenderName: string;
  spenderImageURL: string | null;
}>;

/** Receipts belong to collations. */
export const receiptTable = sqliteTable("receipt", {
  id: text("id")
    .notNull()
    .primaryKey()
    .$defaultFn(() => createId()),
  totalAmount: real("total_amount").notNull(),

  /** When you want to segment the total amount by person. You can use this. */
  segmentedAmounts: text("segmented_amounts", {
    mode: "json",
  }).$type<SegmentedAmountsColumn>(),

  imageObjKey: text("image_objkey").notNull().default(""),

  createdTimestamp: text("created_timestamp").default(sql`(CURRENT_TIMESTAMP)`),
  updatedTimestamp: text("updated_timestamp").default(sql`(CURRENT_TIMESTAMP)`),

  // References:
  collationId: text("collation_id")
    .notNull()
    .references(() => collationTable.id),
});

/**
 * This is a cache for segmented amount column names maintained in the Application layer.
 * This is written to whenever there's a write to receipts's segmented amounts.
 */
export const receiptSegmentedAmountsSpenderTable = sqliteTable(
  "receipts_segmented_amounts_spender",
  {
    id: text("id")
      .notNull()
      .primaryKey()
      .$defaultFn(() => createId()),
    name: text("name").notNull(),
    imageURL: text("imageURL"),

    // References:
    collationId: text("collation_id")
      .notNull()
      .references(() => collationTable.id),
  }
);
