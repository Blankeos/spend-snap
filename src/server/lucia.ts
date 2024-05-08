import { Lucia, TimeSpan } from "lucia";
import { db } from "./db";
import { DrizzleSQLiteAdapter } from "@lucia-auth/adapter-drizzle";
import { sessionTable, userTable } from "./schema/auth";
import { config } from "@/config";

const adapter = new DrizzleSQLiteAdapter(db, sessionTable, userTable);

export const lucia = new Lucia(adapter, {
  // sessionExpiresIn: new TimeSpan(5, "s"),
  sessionCookie: {
    attributes: {
      // set to `true` when using HTTPS
      secure: config.node_env === "production",
    },

    /**
     * Why you might want to set this to `false`
     * Note: Lucia refreshes "nearly expired" (less-than-half left until expired)
     * cookies in the middleware. If you call your APIs on the server-side, your
     * browser won't be able to save the new cookie.
     *
     * In a metaframework like Next.js or Svelte, where you sometimes perform
     * `fetch` on your own API on the server-side (getServerSideProps or +page.server.ts),
     * it's possible to not pass the new cookie back to the client (Automatically).
     *
     * If you're determined to set this to `true` for the above usecase.
     * Alternatively: You should make sure to send the Request and Respose back
     * between the browser -> ssr -> api -> ssr -> browser.
     */
    expires: true, // Default: true,
  },
  getUserAttributes: (attributes) => {
    return {
      // attributes has the type of DatabaseUserAttributes
      username: attributes.username,
    };
  },
});

declare module "lucia" {
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: typeof userTable.$inferSelect;
  }
}

interface DatabaseUserAttributes {
  username: string;
}
