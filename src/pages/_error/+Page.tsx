import Button from "@/components/Button";
import { Match, Show, Switch } from "solid-js";
import { usePageContext } from "vike-solid/usePageContext";
import { navigate } from "vike/client/router";

export default function Page() {
  const pageContext = usePageContext();

  return (
    <main class="text-center mx-auto text-gray-700 p-4 h-[90vh] flex flex-col items-center justify-center">
      <Switch fallback={"500 Internal Server Error"}>
        <Match when={pageContext.is404}>
          <div class="flex flex-col gap-y-6">
            <h1 class="max-6-xs text-4xl text-gray-800 font-bold">
              Page not found
            </h1>
            <p>Sorry, we couldn't find the page you're looking for.</p>
            <div class="flex gap-y-2 justify-center items-center">
              <Button
                onClick={() => {
                  navigate("/");
                }}
              >
                Go back
              </Button>
            </div>
          </div>
        </Match>
      </Switch>
      {/* <p class="mt-8">
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
      </p> */}
    </main>
  );
}
