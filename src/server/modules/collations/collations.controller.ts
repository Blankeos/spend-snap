import { collationsDAO } from "@/server/dao/collations.dao";
import { Hono } from "hono";
import { authMiddleware, requireAuthMiddleware } from "../auth/auth.middleware";
import { tbValidator } from "@hono/typebox-validator";
import { Type as T } from "@sinclair/typebox";
import { HTTPException } from "hono/http-exception";
import s3 from "@/server/s3";
import { createId } from "@paralleldrive/cuid2";
import { privateConfig } from "@/config.private";

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

      console.log(newCollation, "\n\n");

      return c.json({ newCollation });
    }
  )
  // Get Collation Details
  .get("/:collationId", async (c) => {
    const collationId = c.req.param("collationId");

    const collation = await collationsDAO.collation.getCollationDetailsById(
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
  // Get Total Spent in Collation TODO: Deprecate?
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
  .get(
    "/:collationId/receipt/generate-upload-url",
    requireAuthMiddleware,
    async (c) => {
      /** This is the filename. */
      const uniqueId = createId();

      const s3UploadUrl = await s3.createPresignedPost({
        Fields: {
          key: `temp/${uniqueId}`,
        },
        Conditions: [
          ["starts-with", "$key", "temp/"],
          ["starts-with", "$Content-Type", "image/"],
          ["content-length-range", 0, 8000000], // 8 MB
        ],
      });

      return c.json({ uploadUrl: s3UploadUrl });
    }
  )
  // Create Receipt
  .post(
    "/:collationId/receipt",
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

      /** Call this right after the record is saved. */
      async function transferFileToPermanent() {
        const oldKey = `temp/${validJSON.imageObjKey}`;
        const newKey = `permanent/${validJSON.imageObjKey}`;

        // Copy the object to the new location.
        await s3
          .copyObject({
            // Add the bucketname in CopySource because you can technically copy from outside a bucket.
            CopySource: `${privateConfig.s3.BUCKET_NAME}/${oldKey}`,
            // This is the write destination bucket.
            Bucket: privateConfig.s3.BUCKET_NAME,
            // No need to add the bucketname here again because this is the write key.
            Key: newKey,
          })
          .promise();

        // Delete from old location.
        await s3.deleteObject({
          Bucket: privateConfig.s3.BUCKET_NAME,
          Key: oldKey,
        });
      }

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

      // ✨ WRITE: Receipt with Segmented Amounts.
      if (validJSON.segmentedAmounts) {
        const totalAmount = validJSON.segmentedAmounts.reduce(
          (_totalAmount, { amount }) => _totalAmount + amount,
          0
        );

        const receipt = await collationsDAO.receipt.createReceipt({
          collationId: collationId,
          segmentedAmounts: validJSON.segmentedAmounts,
          totalAmount: totalAmount,
          imageObjKey: validJSON.imageObjKey,
        });
      }
      // ✨ WRITE: Receipt with Total Amounts.
      else if (validJSON.totalAmount) {
        const receipt = await collationsDAO.receipt.createReceipt({
          collationId: collationId,
          totalAmount: validJSON.totalAmount,
          imageObjKey: validJSON.imageObjKey,
        });
      }

      // Assumes both operations were successful.
      // Transfer the image to permanent.
      // TODO: Wrap in transaction (too much work for me :D, so not doing that for now).
      await transferFileToPermanent();
    }
  );
