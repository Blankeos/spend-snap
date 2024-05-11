import { lucia } from "@/server/lucia";
import { getCookie } from "hono/cookie";
import type { User, Session } from "lucia";
import { createFactory } from "hono/factory";
import { validateSession } from "@/server/utils/validateSession";
import { HTTPException } from "hono/http-exception";

const authMiddlewareFactory = createFactory<{
  Variables: {
    user: User | null;
    session: Session | null;
  };
}>();

/**
 * Use this middleware to set the `user` and `session` properties on the request object.
 *
 * @example
 * // For controller-level.
 * const myController = new Hono()
 *      .use(authMiddleware)
 *      .get("/", async (c) => {
 *          const user = c.get("user");
 *          if (!user) {
 *          	return c.body(null, 401);
 *          }
 *          // ...
 *      });
 * 
 * // For resolver-level.
 * .get("/", authMiddleware, async (c) => {
 *     const user = c.get("user");
 *     ...
 * })
 })
 *
 * Modified from: https://lucia-auth.com/guides/validate-session-cookies/hono
 */
export const authMiddleware = authMiddlewareFactory.createMiddleware(
  async (c, next) => {
    // 1. Check cookie.session.
    const sessionId = getCookie(c, lucia.sessionCookieName) ?? null;

    // 2. Validate session. (This is what I personally think Lucia's validateSession should be doing).
    const { user, session, sessionCookie } = await validateSession(sessionId);

    // use `header()` instead of setCookie to avoid TS errors
    if (sessionCookie) {
      c.header("Set-Cookie", sessionCookie.serialize(), {
        append: true,
      });
    }

    c.set("user", user);
    c.set("session", session);

    return next();
  }
);

const requireAuthMiddlewareFactory = createFactory<{
  Variables: {
    user: User;
    session: Session;
  };
}>();

/**
 * Use this middleware to require authentication on a route.
 * Make susre to use authMiddleware along-side it.
 * 
 * @example
 * // For controller-level.
 * const myController = new Hono()
 *      .use(authMiddleware)
 *      .use(requireAuthMiddleware)
 *      .get("/", async (c) => {
 *          // Unauthorized users can't access this.
 *      });
 * 
 * // For resolver-level.
 * .get("/", authMiddleware, requireAuthMiddleware, async (c) => {
 *     // Unauthorized users can't access this.
 * })
 })
 */
export const requireAuthMiddleware =
  requireAuthMiddlewareFactory.createMiddleware(async (c, next) => {
    const session = c.get("session");

    if (!session) {
      throw new HTTPException(401, { message: "Unauthorized." });
    }

    return next();
  });
