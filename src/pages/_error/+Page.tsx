import { Match, Show, Switch } from "solid-js";

export default function Page(props: { is404: boolean; errorInfo?: string }) {
  return (
    <main class="text-center mx-auto text-gray-700 p-4">
      <h1 class="max-6-xs text-6xl text-sky-700 font-thin uppercase my-16">
        <Switch fallback={"500 Internal Server Error"}>
          <Match when={props.is404}>404 Page Not Found</Match>
        </Switch>
      </h1>
      <p class="mt-8">
        Visit{" "}
        <a
          href="https://solidjs.com"
          target="_blank"
          class="text-sky-600 hover:underline"
        >
          solidjs.com
        </a>{" "}
        to learn how to build Solid apps.
      </p>
      <p class="my-4">
        <a href="/" class="text-sky-600 hover:underline">
          Home
        </a>
        {" - "}
        <a href="/about" class="text-sky-600 hover:underline">
          About Page
        </a>
      </p>
    </main>
  );
}
