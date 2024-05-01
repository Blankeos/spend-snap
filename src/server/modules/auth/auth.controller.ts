import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";

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
  .get("/", async (c) => {
    return c.json({
      users: users,
    });
  })
  .get("/login", async (c) => {})
  .post("/register", async (c) => {})
  .get("/logout", async (c) => {});
