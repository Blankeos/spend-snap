import { appRouter } from "@/server/_app";
import { collationsDAO } from "@/server/dao/collations.dao";
import { Hono } from "hono";
import { authMiddleware, requireAuthMiddleware } from "../auth/auth.middleware";
import { tbValidator } from "@hono/typebox-validator";
import { Type as T } from "@sinclair/typebox";

export const collationsController = new Hono()
  .basePath("/collations")
  .use(authMiddleware)
  .use(requireAuthMiddleware)
  .get("/", async (c) => {
    const user = c.get("user");

    const collations = await collationsDAO.collation.getCollationsByUserId(
      user.id
    );

    return c.json(collations);
  })
  .post(
    "/",
    tbValidator(
      "json",
      T.Object({
        name: T.String(),
        description: T.Optional(T.String()),
        totalBudget: T.Number(),
      })
    ),
    async (c) => {
      const validJSON = c.req.valid("json");

      const user = c.get("user");

      const newCollation = await collationsDAO.collation.createCollation({
        name: validJSON.name,
        description: validJSON.description,
        totalBudget: validJSON.totalBudget,
        createdById: user.id,
      });

      console.log(newCollation, "\n\n");

      return c.json({ newCollation });
    }
  )
  .get("/:collationId", async (c) => {
    const user = c.get("user");
    const collationId = c.req.param("collationId");

    const collation = await collationsDAO.collation.getCollationDetailsById(
      collationId
    );

    return c.json(collation);
  });
