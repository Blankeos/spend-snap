//
// How to serve Vike (SSR middleware) via a Hono server.
// https://github.com/phonzammi/vike-hono-example/blob/main/server/index.ts
import { config } from "@/config";
import { Hono } from "hono";
import { renderPage } from "vike/server";

const app = new Hono();

app.get("/api/*", async (c, next) => {
  return c.json({ message: "You are in the API." });
});

app.get("*", async (c, next) => {
  const pageContextInit = {
    urlOriginal: c.req.url,
  };
  const pageContext = await renderPage(pageContextInit);
  const { httpResponse } = pageContext;
  if (!httpResponse) {
    return next();
  } else {
    const { body, statusCode, headers } = httpResponse;
    headers.forEach(([name, value]) => c.header(name, value));
    c.status(statusCode);

    return c.body(body);
  }
});

export default {
  port: config.port,
  fetch: app.fetch,
};
