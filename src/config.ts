export const config = {
  /** Port of the app (in dev). */
  PORT: (import.meta.env.PORT || 3000) as number,
  /** The base origin of the app. */
  PUBLIC_ENV__BASE_ORIGIN:
    import.meta.env.PUBLIC_ENV__BASE_ORIGIN || "http://localhost:3000",
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
  s3: {
    APPLICATION_KEY: import.meta.env.S3_APPLICATION_KEY!,
    APPLICATION_KEY_ID: import.meta.env.S3_APPLICATION_KEY_ID!,
    BUCKET_NAME: import.meta.env.S3_BUCKET_NAME!,
    REGION: import.meta.env.S3_REGION!,
    ENDPOINT: import.meta.env.S3_ENDPOINT!,
  },
};
