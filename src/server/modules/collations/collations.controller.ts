import { appRouter } from "@/server/_app";
import { collationsDAO } from "@/server/dao/collations.dao";
import { Hono } from "hono";
import { authMiddleware, requireAuthMiddleware } from "../auth/auth.middleware";
import { tbValidator } from "@hono/typebox-validator";
import { Type as T } from "@sinclair/typebox";
import { HTTPException } from "hono/http-exception";

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
    const collationId = c.req.param("collationId");

    const collation = await collationsDAO.collation.getCollationDetailsById(
      collationId
    );

    return c.json(collation);
  })
  .get("/:collationId/spenders", async (c) => {
    const collationId = c.req.param("collationId");

    const spenders =
      await collationsDAO.receipt.getReceiptSpendersByCollationId(collationId);

    return c.json({
      spenders,
    });
  })
  .post(
    "/:collationId/spenders",
    tbValidator(
      "json",
      T.Object({
        name: T.String(),
        imageURL: T.Optional(T.String()),
      })
    ),
    async (c) => {
      const collationId = c.req.param("collationId");
      const validJSON = c.req.valid("json");

      const spenders =
        await collationsDAO.receipt.createNewSegmentedAmountsSpender({
          collationId: collationId,
          name: validJSON.name,
          imageURL: validJSON.imageURL,
        });

      return c.json({ spenders });
    }
  )
  // TODO: deprecate
  .get("/:collationId/receipt/totalSpent", async (c) => {
    const collationId = c.req.param("collationId");

    const receipts = await collationsDAO.receipt.getReceiptsByCollationId(
      collationId
    );

    const totalSpent = receipts.reduce((_totalSpent, receipt) => {
      return _totalSpent + receipt.totalAmount;
    }, 0);

    return c.json({ totalSpent });
  })
  .post(
    "/:collationId/receipt",
    tbValidator(
      "json",
      T.Object({
        imageObjKey: T.String(),
        totalAmount: T.Optional(
          T.Number({
            description:
              "`segmentedAmounts` shouldn't be used when this is provided.",
          })
        ),
        segmentedAmounts: T.Optional(
          T.Array(
            T.Object({
              spenderId: T.String(),
              amount: T.Number(),
            }),
            {
              description:
                "`totalAmount` shouldn't be used when this is provided.",
            }
          )
        ),
      })
    ),
    async (c) => {
      const collationId = c.req.param("collationId");
      const validJSON = c.req.valid("json");

      const collation = await collationsDAO.collation.getCollationById(
        collationId
      );

      if (!collation)
        throw new HTTPException(404, { message: "Collation not found." });

      if (validJSON.segmentedAmounts) {
        const totalAmount = validJSON.segmentedAmounts.reduce(
          (_totalAmount, { amount }) => _totalAmount + amount,
          0
        );

        // TODO: transfer imageObjKey from /temp to /used.

        const receipt = await collationsDAO.receipt.createReceipt({
          collationId: collationId,
          segmentedAmounts: validJSON.segmentedAmounts,
          totalAmount: totalAmount,
          imageObjKey: validJSON.imageObjKey,
        });
      }
    }
  );
