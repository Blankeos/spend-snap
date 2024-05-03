// Icons
import Icons from "unplugin-icons/vite";

// Vike
import vike from "vike/plugin";
import vikeSolid from "vike-solid/vite";

// Hono
import devServer from "@hono/vite-dev-server";

// Vite
import { resolve, dirname } from "node:path";
import { defineConfig } from "vite";
import { fileURLToPath } from "node:url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const root = resolve(__dirname, ".");

export default defineConfig({
  build: {
    minify: true,
  },
  plugins: [
    devServer({
      entry: "./src/server/index.ts",
      exclude: [
        /^\/@.+$/,
        /.*\.(ts|tsx|vue)($|\?)/,
        /.*\.(s?css|less)($|\?)/,
        /^\/favicon\.ico$/,
        /.*\.(svg|png)($|\?)/,
        /^\/(public|assets|static)\/.+/,
        /^\/node_modules\/.*/,
      ],
      injectClientScript: false,
    }),
    vike(),
    vikeSolid(),
    Icons({
      compiler: "solid",
    }),
  ],
  server: {
    port: 3000,
  },
  preview: {
    port: 3000,
  },
  resolve: {
    alias: {
      "@": resolve(root, "src"),
    },
  },
});
