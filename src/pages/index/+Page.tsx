import Counter from "@/components/Counter";
import { useData } from "vike-solid/useData";
import { Data } from "./+data";
import { useStore } from "@nanostores/solid";
import { $count } from "@/contexts/countStore";
import Button from "@/components/Button";

export default function Home() {
  return (
    <>
      <section class="py-20 bg-primary">
        <div class="mx-auto text-center max-w-3xl px-8 flex flex-col items-center gap-y-3">
          <div class="rounded-full glass px-5 border border-primary py-1 w-max text-gray-50 text-xs">
            Welcome To Spend Snap
          </div>
          <h1 class="text-5xl font-bold mb-6 text-white tracking-tight">
            Going on a Company Trip? Track your Receipts!
          </h1>
          <p class="text-xl mb-5 text-gray-200">
            Unify all your receipts and automate your expense tracking workflow.
            So you can process your claims without headache.
          </p>
          <a class="bg-white text-primary text-sm py-2 px-8 rounded-full w-max">
            Open an Account
          </a>
        </div>
      </section>
      <div class="h-2 bg-primary opacity-60" />
      <div class="h-2 bg-primary opacity-40" />
      <div class="h-2 bg-primary opacity-10" />

      <section class="py-12 flex flex-col items-center gap-y-6 px-5">
        <h2 class="text-2xl font-semibold">✨ Fantastic Features ✨</h2>
        <div class="container mx-auto grid md:grid-cols-3 gap-6 text-center">
          <div class="p-6 bg-primary rounded-lg glass">
            <h2 class="text-2xl font-bold mb-4 text-white">Receipt Logging</h2>
            <p class="text-gray-300">
              Keep a clean log of your receipt, amounts, and{" "}
              <strong>proof images</strong>!
            </p>
          </div>
          <div class="p-6 bg-primary rounded-lg glass">
            <h2 class="text-2xl font-bold mb-4 text-white">Shareable Links</h2>
            <p class="text-gray-300">
              Let your stakeholders know exactly what you've spent on before the
              trip even ends!
            </p>
          </div>
          <div class="p-6 bg-primary rounded-lg glass">
            <h2 class="text-2xl font-bold mb-4 text-white">Graphs</h2>
            <p class="text-gray-300">
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
            <h4 class="text-xl font-semibold">Hi, it's Carlo 👋</h4>
            <p>
              I built this project in May 6 2024 so I can track receipts for my
              company's trip. Anyway, not sure what I'll do with this. Built it
              with 💙 using <b>SolidJS + Hono + Vike</b>.
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
