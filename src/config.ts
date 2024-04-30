import "dotenv/config";

export const config = {
  database: {
    /** The url of the database. */
    url: process.env.DATABASE_URL!,
    /** Not needed in development. https://docs.turso.tech/local-development#sqlite */
    authToken: process.env.DATABASE_AUTH_TOKEN!,
  },
};
