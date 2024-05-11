import { db } from "@/server/db";
import {
  collationTable,
  receiptSegmentedAmountsSpenderTable,
  receiptTable,
} from "../schema/collations";
import { arrayOverlaps, eq, sql } from "drizzle-orm";
import { HTTPException } from "hono/http-exception";

export const collationsDAO = {
  collation: {
    getCollationsByUserId: async (userId: string) => {
      const result = await db
        .select()
        .from(collationTable)
        .where(eq(collationTable.createdById, userId))
        .execute();

      return result;
    },

    /** Gets a collation joined with its relations. */
    getCollationDetailsById: async (collationId: string) => {
      const collation = await db
        .select()
        .from(collationTable)
        .where(eq(collationTable.id, collationId))
        // TODO: add joins here.
        .execute();

      return collation?.[0] ?? null;
    },

    createCollation: async (params: typeof collationTable.$inferInsert) => {
      const collation = await db
        .insert(collationTable)
        .values({
          ...params,
        })
        .returning()
        .execute();

      return collation?.[0] ?? null;
    },

    deleteCollationById: async (collationId: string) => {
      const result = await db
        .delete(collationTable)
        .where(eq(collationTable.id, collationId))
        .execute();
    },
  },

  receipt: {
    getReceiptsByCollationId: async (collationId: string) => {
      const receipts = await db
        .select()
        .from(collationTable)
        .where(eq(collationTable.id, collationId))
        .execute();

      return receipts?.[0] ?? null;
    },

    createNewSegmentedAmountsSpender: async (
      params: typeof receiptSegmentedAmountsSpenderTable.$inferInsert
    ) => {
      const spenders = await db
        .insert(receiptSegmentedAmountsSpenderTable)
        .values(params)
        .returning()
        .execute();

      return spenders?.[0] ?? null;
    },

    createReceipt: async (
      params: Pick<
        typeof receiptTable.$inferInsert,
        | "id"
        | "imageObjKey"
        | "totalAmount"
        | "createdTimestamp"
        | "updatedTimestamp"
        | "collationId"
      > & { segmentedAmounts: { spenderId: string; amount: number }[] }
    ) => {
      const segmentedAmountsMap = new Map<
        string,
        (typeof params.segmentedAmounts)[0]
      >();
      params.segmentedAmounts.forEach((segmentedAmount) => {
        segmentedAmountsMap.set(segmentedAmount.spenderId, segmentedAmount);
      });

      const spenderIds = Object.keys(segmentedAmountsMap ?? {});

      const receipt = await db.transaction(async (tx) => {
        const existingSpenders = await tx
          .select()
          .from(receiptSegmentedAmountsSpenderTable)
          .where(sql`id IN (${sql.join(spenderIds, ",")})`)
          .execute();

        if (existingSpenders.length !== spenderIds.length) {
          throw new HTTPException(400, {
            message: `Some spender ids ${spenderIds} do not exist.`,
          });
        }

        const segmentedAmounts = existingSpenders.map((existingSpender) => ({
          spenderImageURL: existingSpender.imageURL,
          spenderName: existingSpender.name,
          spenderId: existingSpender.id,
          amount: segmentedAmountsMap.get(existingSpender.id)?.amount ?? 0,
        }));

        const receipts = await tx
          .insert(receiptTable)
          .values({
            id: params.id,
            collationId: params.collationId,
            totalAmount: params.totalAmount,
            segmentedAmounts: segmentedAmounts,
          })
          .returning()
          .execute();

        return receipts?.[0] ?? null;
      });

      return receipt;
    },
  },
};
