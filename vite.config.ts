import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import Icons from "unplugin-icons/vite";
import { defineConfig } from "vite";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const root = resolve(__dirname, ".");

export default defineConfig({
  plugins: [
    Icons({
      compiler: "solid",
    }),
  ],
  resolve: {
    alias: {
      "@": resolve(root, "src"),
    },
  },
});
