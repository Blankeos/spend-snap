export const config = {
  port: (process.env.PORT || 3000) as number,
  node_env:
    process.env.NODE_ENV ?? ("development" as "development" | "production"),
  database: {
    /** The url of the database. */
    url: process.env.DATABASE_URL!,
    /** Not needed in development. https://docs.turso.tech/local-development#sqlite */
    authToken: process.env.DATABASE_AUTH_TOKEN!,
  },
};
