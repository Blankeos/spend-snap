declare global {
  // For Vike types
  namespace Vike {
    interface PageContext {
      headers: Record<string, string>;
    }
  }
}

// If you define Vike.PageContext in a .d.ts file then
// make sure there is at least one export/import statment.
// Tell TypeScript this file isn't an ambient module:
export {};
