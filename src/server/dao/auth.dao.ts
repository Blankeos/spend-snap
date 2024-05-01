import { db } from "@/server/db";
import { eq } from "drizzle-orm";
import { userTable } from "../schema/auth";
import { generateIdFromEntropySize } from "lucia";
export const authDAO = {
  user: {
    findByUsername: async (username: string) => {
      const user = await db
        .select()
        .from(userTable)
        .where(eq(userTable.username, username))
        .limit(1)
        .execute();

      if (!user || user.length === 0) {
        return null;
      }
      return user[0];
    },
    findByUserId: async (userId: string) => {
      const user = await db
        .select()
        .from(userTable)
        .where(eq(userTable.id, userId))
        .limit(1)
        .execute();

      if (!user || user.length === 0) {
        return null;
      }

      return user[0];
    },
    createFromUsernameAndPassword: async (
      username: string,
      passwordHash: string
    ) => {
      const userId = generateIdFromEntropySize(10); // 16 characters long

      await db
        .insert(userTable)
        .values({ id: userId, username, passwordHash })
        .execute();
      return { userId };
    },
  },
};
