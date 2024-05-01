import Counter from "@/components/Counter";
import { useData } from "vike-solid/useData";
import { Data } from "./+data";
import { useStore } from "@nanostores/solid";
import { $count } from "@/contexts/countStore";

export default function Home() {
  const { randomValue } = useData<Data>();
  const count = useStore($count);

  return (
    <main class="text-center mx-auto text-gray-700 p-4">
      <h1 class="max-6-xs text-6xl text-sky-700 font-thin uppercase my-16">
        Hello World!!! {randomValue}
      </h1>

      <Counter />
      <button
        class="ml-2 btn btn-secondary"
        onClick={() => {
          $count.setKey("countClicked", count().countClicked + 1);
        }}
      >
        NanoStore {count().countClicked}
      </button>

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
        <span>Home</span>
        {" - "}
        <a href="/about" class="text-sky-600 hover:underline">
          About Page
        </a>{" "}
      </p>
    </main>
  );
}
