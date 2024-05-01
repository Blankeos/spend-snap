// src/middleware.ts
import { Hono, MiddlewareHandler } from "hono";
import { lucia } from "@/server/lucia";
import { getCookie } from "hono/cookie";
import { csrf } from "hono/csrf";
import type { User, Session } from "lucia";

import { createFactory, createMiddleware } from "hono/factory";

const factory = createFactory<{
  Variables: {
    user: User | null;
    session: Session | null;
  };
}>();

const luciaAuthMiddleware = factory.createMiddleware(async (c, next) => {
  const sessionId = getCookie(c, lucia.sessionCookieName) ?? null;
  if (!sessionId) {
    c.set("user", null);
    c.set("session", null);
    return next();
  }
  const { session, user } = await lucia.validateSession(sessionId);
  if (session && session.fresh) {
    // use `header()` instead of `setCookie()` to avoid TS errors
    c.header("Set-Cookie", lucia.createSessionCookie(session.id).serialize(), {
      append: true,
    });
  }
  if (!session) {
    c.header("Set-Cookie", lucia.createBlankSessionCookie().serialize(), {
      append: true,
    });
  }
  c.set("user", user);
  c.set("session", session);
  return next();
});

/**
 * Use this middleware to set the `user` and `session` properties on the request object.
 *
 * @example
 * const myController = new Hono()
 *      .use(...authMiddlewares)
 *      .get("/", async (c) => {
 *          const user = c.get("user");
 *          if (!user) {
 *          	return c.body(null, 401);
 *          }
 *          // ...
 *      });
 *
 * Modified from: https://lucia-auth.com/guides/validate-session-cookies/hono
 */
export const authMiddlewares = [
  // see https://hono.dev/middleware/builtin/csrf for more options
  csrf(),
  luciaAuthMiddleware,
] as const;
