import { Hono } from "hono";
import { authController } from "./modules/auth/auth.controller";
import { collationsController } from "./modules/collations/collations.controller";
import { csrf } from "hono/csrf";

const app = new Hono();

// see https://hono.dev/middleware/builtin/csrf for more options
app.use(csrf());

app.get("/", (c) => c.json({ status: "Alive" }));
/**
 * The base router. Include all the routes here from `./routes/*`
 */
export const appRouter = app
  .route("/", authController)
  .route("/", collationsController); // add .route(newController).route(otherController) for extra routers here.

/** Exported type definition for the hono/client. */
export type AppRouter = typeof appRouter;
