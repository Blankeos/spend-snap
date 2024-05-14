import { privateConfig } from "@/config.private";
import AWS from "aws-sdk";

const s3 = new AWS.S3({
  endpoint: privateConfig.s3.ENDPOINT,
  region: privateConfig.s3.REGION,
  credentials: {
    accessKeyId: privateConfig.s3.ACCESS_KEY_ID,
    secretAccessKey: privateConfig.s3.SECRET_ACCESS_KEY,
  },
});

export default s3;

// Example Usage:
// s3.putObject({
//   Body: "Content of the File",
//   Bucket: B2_BUCKET_NAME,
//   Key: "FileName.jpg"
// });
