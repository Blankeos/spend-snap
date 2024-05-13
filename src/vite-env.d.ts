declare global {
  declare module "solid-js" {
    namespace JSX {
      interface Directives {
        form: (node: HTMLFormElement) => void;
      }
    }
  }
}

declare module "*.png";
