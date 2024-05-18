import { collationsDAO } from "@/server/dao/collations.dao";
import { Hono } from "hono";
import { authMiddleware, requireAuthMiddleware } from "../auth/auth.middleware";
import { tbValidator } from "@hono/typebox-validator";
import { Awaited, Type as T, TNumber } from "@sinclair/typebox";
import { HTTPException } from "hono/http-exception";
import {
  generateUploadUrl,
  getImageUrlFromImageObjKey,
  transferFileFromTempToPermanent,
} from "@/server/s3";
import { createId } from "@paralleldrive/cuid2";

export const collationsController = new Hono()
  .basePath("/collations")
  .use(authMiddleware)
  // Get All Collations
  .get("/", requireAuthMiddleware, async (c) => {
    const user = c.get("user");

    const collations = await collationsDAO.collation.getCollationsByUserId(
      user.id
    );

    return c.json(collations);
  })
  // Create New Collation
  .post(
    "/",
    requireAuthMiddleware,
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

      return c.json({ newCollation });
    }
  )
  // Get Collation By Id
  .get("/:collationId", async (c) => {
    const collationId = c.req.param("collationId");

    const collation = await collationsDAO.collation.getCollationById(
      collationId
    );

    return c.json(collation);
  })
  // Get Collation Spenders
  .get("/:collationId/spenders", async (c) => {
    const collationId = c.req.param("collationId");

    const spenders =
      await collationsDAO.receipt.getReceiptSpendersByCollationId(collationId);

    return c.json({
      spenders,
    });
  })
  // Add New Segmented Amount Spender
  .post(
    "/:collationId/spenders",
    requireAuthMiddleware,
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
  // Get Receipts By Collation
  .get(
    "/:collationId/receipts",
    tbValidator(
      "query",
      T.Object({
        page: T.String({
          pattern: "^\\d+$",
          description: "Should be a number.",
        }),
        limit: T.String({
          pattern: "^\\d+$",
          description: "Should be a number.",
        }),
      })
    ),
    async (c) => {
      const collationId = c.req.param("collationId");
      const input = c.req.valid("query");

      const receipts = await collationsDAO.receipt.getReceiptsByCollationId(
        collationId,
        {
          page: parseInt(input.page),
          limit: parseInt(input.limit),
        }
      );

      return c.json({
        receipts: receipts,
      });
    }
  )
  // Get Total Spent in Collation
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
  // Generate Upload URL for Receipt Image (Do this before Create Receipt)
  .get("/receipt/generateUploadUrl", requireAuthMiddleware, async (c) => {
    const uniqueId = createId();

    const { fields, signedUrl } = await generateUploadUrl(uniqueId);

    return c.json({
      uniqueId: uniqueId,
      signedUrl: signedUrl,
      fields: fields,
    });
  })
  .get("/receipt/image/:uniqueId", async (c) => {
    const uniqueId = c.req.param("uniqueId");

    const imageUrl = await getImageUrlFromImageObjKey(uniqueId);

    if (!imageUrl)
      throw new HTTPException(404, {
        message: "Image Object Key not found in storage.",
      });

    return c.text(imageUrl);
  })
  // Create Receipt
  .post(
    "/:collationId/receipts",
    requireAuthMiddleware,
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

      // Validate that user has inputted either `totalAmount` or `segmentedAmounts` (exclusively).
      const bothAreProvided =
        validJSON.totalAmount && validJSON.segmentedAmounts;
      const neitherAreProvided =
        !validJSON.totalAmount && !validJSON.segmentedAmounts;

      if (bothAreProvided || neitherAreProvided)
        throw new HTTPException(400, {
          message:
            "Please input either `totalAmount` or `segmentedAmounts`, but not both.",
        });

      // Validate collation exists.
      const collation = await collationsDAO.collation.getCollationById(
        collationId
      );

      if (!collation)
        throw new HTTPException(404, { message: "Collation not found." });

      let receipt: Awaited<
        ReturnType<typeof collationsDAO.receipt.createReceipt>
      > | null = null;

      // ✨ WRITE: Receipt with Segmented Amounts.
      if (validJSON.segmentedAmounts) {
        const totalAmount = validJSON.segmentedAmounts.reduce(
          (_totalAmount, { amount }) => _totalAmount + amount,
          0
        );

        receipt = await collationsDAO.receipt.createReceipt({
          collationId: collationId,
          segmentedAmounts: validJSON.segmentedAmounts,
          totalAmount: totalAmount,
          imageObjKey: validJSON.imageObjKey,
        });
      }
      // ✨ WRITE: Receipt with Total Amounts.
      else if (validJSON.totalAmount) {
        receipt = await collationsDAO.receipt.createReceipt({
          collationId: collationId,
          totalAmount: validJSON.totalAmount,
          imageObjKey: validJSON.imageObjKey,
        });
      }

      // Assumes both operations were successful.
      // Transfer the image to permanent.
      // TODO: Wrap in transaction (too much work for me :D, so not doing that for now).
      await transferFileFromTempToPermanent(validJSON.imageObjKey);

      return c.json({
        receipt: receipt,
      });
    }
  );
