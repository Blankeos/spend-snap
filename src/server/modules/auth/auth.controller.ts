import { Hono } from "hono";
import {
  getCookie,
  getSignedCookie,
  setCookie,
  setSignedCookie,
  deleteCookie,
} from "hono/cookie";

import { z } from "zod";
import { register } from "./services/register.service";

// Validator
import { tbValidator } from "@hono/typebox-validator";
import { Type as T } from "@sinclair/typebox";
import { authMiddlewares } from "./auth.middleware";
import { lucia } from "@/server/lucia";
import { login } from "./services/login.service";

/** Fake database */
const users = [
  {
    id: 1,
    name: "John",
  },
  {
    id: 2,
    name: "Carlo",
  },
  {
    id: 3,
    name: Bun.env.NODE_ENV,
  },
];

export const authController = new Hono()
  .basePath("/auth")
  .use(...authMiddlewares)
  .get("/", async (c) => {
    const session = c.get("session");
    const user = c.get("user");

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
