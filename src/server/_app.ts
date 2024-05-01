import { Hono } from "hono";
import { authController } from "./modules/auth/auth.controller";
import { collationsController } from "./modules/collations/collations.controller";

const app = new Hono();

app.get("/", (c) => c.json({ status: "Alive" }));
/**
 * The base router. Include all the routes here from `./routes/*`
 */
export const appRouter = app
  .route("/", authController)
  .route("/", collationsController); // add .route().route() for extra routers here.

/** Exported type definition for the hono/client. */
export type AppRouter = typeof appRouter;
