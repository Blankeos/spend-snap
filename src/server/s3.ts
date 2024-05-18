import { privateConfig } from "@/config.private";
import {
  CopyObjectCommand,
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

/** The new AWS-SDK V3 JavaScript SDK */
export const s3Client = new S3Client({
  endpoint: privateConfig.s3.ENDPOINT,
  region: privateConfig.s3.REGION,
  credentials: {
    accessKeyId: privateConfig.s3.ACCESS_KEY_ID,
    secretAccessKey: privateConfig.s3.SECRET_ACCESS_KEY,
  },
});

// ===========================================================================
// S3 Services
// ===========================================================================

/**
// Source: https://chatwithcloud.ai/aws-practical-examples/create-presigned-s3-url-for-uploading-using-aws-sdk-v3-for-js-and-ts
 */
export async function generateUploadUrl(uniqueId: string) {
  const command = new PutObjectCommand({
    Bucket: privateConfig.s3.BUCKET_NAME,
    Key: `temp/${uniqueId}`,
  });

  const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });

  return signedUrl;
}

export async function transferFileFromTempToPermanent(uniqueId: string) {
  const oldKey = `temp/${uniqueId}`;
  const newKey = `permanent/${uniqueId}`;

  console.log(
    "[transferFileFromtempToPermanent] Transferring",
    oldKey,
    "to",
    newKey
  );

  // Copy the object to the new location.
  await s3Client.send(
    new CopyObjectCommand({
      Bucket: privateConfig.s3.BUCKET_NAME,
      CopySource: `${privateConfig.s3.BUCKET_NAME}/${oldKey}`,
      Key: newKey,
    })
  );

  console.log("[transferFileFromtempToPermanent] Deleting", oldKey);
  // Delete from old location.
  await s3Client.send(
    new DeleteObjectCommand({
      Bucket: privateConfig.s3.BUCKET_NAME,
      Key: oldKey,
    })
  );
}

// OLD (AWS-SDK V2 Javascript SDK)
// const s3 = new AWS.S3({
//   endpoint: privateConfig.s3.ENDPOINT,
//   region: privateConfig.s3.REGION,
//   credentials: {
//     accessKeyId: privateConfig.s3.ACCESS_KEY_ID,
//     secretAccessKey: privateConfig.s3.SECRET_ACCESS_KEY,
//   },
// });

// export default s3;

// Example Usage:
// s3.putObject({
//   Body: "Content of the File",
//   Bucket: B2_BUCKET_NAME,
//   Key: "FileName.jpg"
// });
