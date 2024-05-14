/** Only place private configurations here. */
export const privateConfig = {
  /** Port of the app (in dev). */
  PORT: (import.meta.env.PORT || 3000) as number,
  /** Development or Production. */
  NODE_ENV: (import.meta.env.NODE_ENV ?? "development") as
    | "development"
    | "production",
  /** DB-specific settings. */
  database: {
    /** The url of the database. */
    URL: import.meta.env.DATABASE_URL!,
    /** Not needed in development. https://docs.turso.tech/local-development#sqlite */
    AUTH_TOKEN: import.meta.env.DATABASE_AUTH_TOKEN!,
  },
  /** S3Bucket-specific settings. */
  s3: {
    /** Application Key ID in B2 (accessKeyId in S3) */
    ACCESS_KEY_ID: import.meta.env.S3_ACCESS_KEY_ID!,
    /** Application Key in B2 (secretAccessKey in S3) */
    SECRET_ACCESS_KEY: import.meta.env.S3_SECRET_ACCESS_KEY!,
    /** Name of the bucket. */
    BUCKET_NAME: import.meta.env.S3_BUCKET_NAME! ?? "spend-snap",
    /** Region of the bucket. */
    REGION: import.meta.env.S3_REGION! ?? "us-east-1",
    /** URL of the bucket. */
    ENDPOINT: import.meta.env.S3_ENDPOINT! ?? "http://localhost:4566",
  },
};
