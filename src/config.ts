export const config = {
  port: (Bun.env.PORT || 3000) as number,
  node_env: Bun.env.NODE_ENV ?? ("development" as "development" | "production"),
  database: {
    /** The url of the database. */
    url: Bun.env.DATABASE_URL!,
    /** Not needed in development. https://docs.turso.tech/local-development#sqlite */
    authToken: Bun.env.DATABASE_AUTH_TOKEN!,
  },
};
