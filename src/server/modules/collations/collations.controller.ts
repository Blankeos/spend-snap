import { appRouter } from "@/server/_app";
import { Hono } from "hono";

export const collationsController = new Hono().basePath("/collations");
