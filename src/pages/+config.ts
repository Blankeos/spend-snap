import type { Config } from "vike/types";
/** @ts-ignore (seems to work) */
import vikeSolid from "vike-solid/config";

// Default config (can be overridden by pages)
export default {
  // <title>
  title: "Spend Snap - Easy way to collate receipts for professional trips.",
  extends: vikeSolid,
} satisfies Config;
