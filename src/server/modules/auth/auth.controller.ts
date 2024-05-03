import { Hono } from "hono";
import { register } from "./services/register.service";

// Validator
import { tbValidator } from "@hono/typebox-validator";
import { Type as T } from "@sinclair/typebox";
import { authMiddleware } from "./auth.middleware";
import { lucia } from "@/server/lucia";
import { login } from "./services/login.service";

export const authController = new Hono()
  .basePath("/auth")
  .use(authMiddleware)
  .get("/", async (c) => {
    const session = c.get("session");
    const user = c.get("user");

    if (!session) {
      return c.json({
        user: null,
      });
    }

    return c.json({
      user: {
        id: user?.id,
        username: user?.username,
      },
    });
  })
  .get("/logout", async (c) => {
    const session = c.get("session");

    if (session) {
      await lucia.invalidateSession(session.id);
    }

    const sessionCookie = lucia.createBlankSessionCookie();

    // use `header()` instead of setCookie to avoid TS errors
    c.header("Set-Cookie", sessionCookie.serialize(), {
      append: true,
    });

    return c.json({
      success: true,
    });
  })
  .post(
    "/login",
    tbValidator(
      "json",
      T.Object({
        username: T.String(),
        password: T.String(),
      })
    ),
    async (c) => {
      // if (c) throw new Error("Already logged in");

      const validJSON = c.req.valid("json");

      const { userId, sessionCookie } = await login({
        username: validJSON.username,
        password: validJSON.password,
      });

      // use `header()` instead of setCookie to avoid TS errors
      c.header("Set-Cookie", sessionCookie.serialize(), {
        append: true,
      });

      return c.json({
        user: {
          id: userId,
          username: validJSON.username,
        },
      });
    }
  )
  .post(
    "/register",

    tbValidator(
      "json",
      T.Object({
        username: T.String(),
        password: T.String(),
      })
    ),
    async (c) => {
      if (c.get("session")?.fresh) throw new Error("Already logged in");

      const validJSON = c.req.valid("json");

      const { userId, sessionCookie } = await register({
        username: validJSON.username,
        password: validJSON.password,
      });

      // use `header()` instead of setCookie to avoid TS errors
      c.header("Set-Cookie", sessionCookie.serialize(), {
        append: true,
      });

      return c.json({
        user: {
          id: userId,
          username: validJSON.username,
        },
      });
    }
  );
