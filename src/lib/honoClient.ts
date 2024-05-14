import { hc as honoClient } from "hono/client";
import type { AppRouter } from "@/server/_app";
import { isServer } from "solid-js/web";
import { publicConfig } from "@/config.public";

const baseurl = isServer ? publicConfig.BASE_ORIGIN : window.location.origin;

export const hc = honoClient<AppRouter>(`${baseurl}/api`);
