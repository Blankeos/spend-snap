import Counter from "@/components/Counter";
import { useData } from "vike-solid/useData";
import { Data } from "./+data";
import { useStore } from "@nanostores/solid";
import { $count } from "@/contexts/countStore";
import Button from "@/components/Button";
import { $user } from "@/contexts/authStore";

export default function Home() {
  const authStore = useStore($user);

  return (
    <>
      <section class="py-20 bg-primary">
        <div class="mx-auto text-center max-w-3xl px-8 flex flex-col items-center gap-y-3">
          <div class="rounded-full glass px-5 border border-primary py-1 w-max text-gray-50 text-xs">
            💰 Welcome To Spend Snap
          </div>
          <h1 class="text-4xl md:text-5xl font-bold mb-6 text-white tracking-tight">
            Going on a Company Trip? Track your Receipts!
          </h1>
          <p class="text-base max-w-lg md:text-xl mb-5 text-white/90">
            Unify all your receipts and automate your expense tracking workflow.
            So you can process your claims without headache.
          </p>
          <a
            class="btn bg-white text-primary text-sm py-2 px-8 rounded-md w-max"
            href="/register"
          >
            {authStore().user ? "Open Dashboard" : "Open an Account"}
          </a>
        </div>
      </section>
      <div class="h-4 bg-primary opacity-60" />
      <div class="h-4 bg-primary opacity-40" />
      <div class="h-4 bg-primary opacity-10" />

      <section class="py-12 flex flex-col items-center gap-y-6 px-5">
        <h2 class="text-2xl font-semibold">✨ Fantastic Features ✨</h2>
        <div class="container mx-auto grid md:grid-cols-3 gap-6 text-center">
          <div class="p-6 bg-primary rounded-lg glass flex flex-col items-center">
            <h2 class="text-2xl font-bold mb-4 text-white">
              📝 Receipt Logging
            </h2>
            <p class="text-gray-300 max-w-lg">
              Keep a clean log of your receipt, amounts, and{" "}
              <strong>proof images</strong>!
            </p>
          </div>
          <div class="p-6 bg-primary rounded-lg glass flex flex-col items-center">
            <h2 class="text-2xl font-bold mb-4 text-white">
              🔗 Shareable Links
            </h2>
            <p class="text-gray-300 max-w-lg">
              Let your stakeholders know exactly what you've spent on before the
              trip even ends!
            </p>
          </div>
          <div class="p-6 bg-primary rounded-lg glass flex flex-col items-center">
            <h2 class="text-2xl font-bold mb-4 text-white">📊 Graphs</h2>
            <p class="text-gray-300 max-w-lg">
              Gain valuable insights into how much of the budget is being used.
            </p>
          </div>
        </div>
      </section>

      <section class="flex flex-col px-10">
        <div class="flex gap-x-5">
          <div class="avatar">
            <div class="w-24 h-24 rounded-full">
              <img src="https://avatars.githubusercontent.com/u/38070918?v=4" />
            </div>
          </div>
          <div class="flex flex-col gap-y-2">
            <h4 class="text-xl font-semibold">
              Hi, it's{" "}
              <a class="text-primary" href="https://carlo.vercel.app/">
                Carlo
              </a>{" "}
              👋
            </h4>
            <p class="text-sm md:text-base">
              I built this project in{" "}
              <span class="font-semibold">May 6 2024</span> so I can track
              receipts for my company's trip. Just a personal project while
              learning other tech as I get into indie-hacking. Might turn this
              into a small startup idk.
            </p>
            <p class="text-xs text-gray-700">
              Built it with 💙 using{" "}
              <b>SolidJS + Hono + Vike + Drizzle + Turso + B2 Backblaze</b>.
            </p>
          </div>
        </div>
      </section>

      <div class="h-20" />
    </>
  );
}
// OLD BUT WANNA KEEP?
// export default function Home() {
//   const { randomValue } = useData<Data>();
//   const count = useStore($count);

//   return (
//     <main class="text-center mx-auto text-gray-700 p-4">
//       <h1 class="max-6-xs text-6xl text-sky-700 font-thin uppercase my-16">
//         Hello World!!! {randomValue}
//       </h1>

//       <Counter />
//       <button
//         class="ml-2 btn btn-secondary"
//         onClick={() => {
//           $count.setKey("countClicked", count().countClicked + 1);
//         }}
//       >
//         NanoStore {count().countClicked}
//       </button>
//       <p class="mt-8">
//         Visit{" "}
//         <a
//           href="https://solidjs.com"
//           target="_blank"
//           class="text-sky-600 hover:underline"
//         >
//           solidjs.com
//         </a>{" "}
//         to learn how to build Solid apps.
//       </p>
//       <p class="my-4">
//         <span>Home</span>
//         {" - "}
//         <a href="/about" class="text-sky-600 hover:underline">
//           About Page
//         </a>{" "}
//       </p>
//     </main>
//   );
// }
