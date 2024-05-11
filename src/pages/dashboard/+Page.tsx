import { $user } from "@/contexts/authStore";
import { useProtectedRoute } from "@/hooks/useProtectedRoute";
import { hc } from "@/lib/honoClient";
import { createForm } from "@felte/solid";
import { validator } from "@felte/validator-superstruct";
import { useStore } from "@nanostores/solid";
import { createQuery } from "@tanstack/solid-query";
import { format } from "numerable";
import { createResource, For, Show } from "solid-js";
import { number, object, optional, string } from "superstruct";

export default function DashboardPage() {
  useProtectedRoute({ redirectTo: "/" });
  const authStore = useStore($user);

  // ===========================================================================
  // Queries
  // ===========================================================================
  const collationsQuery = createQuery(() => ({
    queryKey: ["collations-page"],
    queryFn: async () => {
      try {
        const response = await hc.collations.$get({});
        return await response?.json();
      } catch (e) {
        return null;
      }
    },
  }));

  // ===========================================================================
  // Form State
  // ===========================================================================

  const struct = object({
    name: string(),
    description: optional(string()),
    totalBudget: number(),
  });

  const { form } = createForm({
    extend: validator({ struct, level: "error" }),
    onSubmit: async (values: typeof struct.TYPE, context) => {
      try {
        const response = await hc.collations.$post({
          json: {
            name: values.name,
            description: values.description,
            totalBudget: values.totalBudget,
          },
        });
        const result = await response?.json();

        await collationsQuery.refetch();

        // @ts-ignore
        document.getElementById("create-collation-modal").close();
      } catch (e) {
        console.log("found an error here...");
      }
    },
  });
  return (
    <Show when={authStore().user} fallback="Not authenticated.">
      <main class="mx-auto max-w-5xl px-7 py-12">
        <div class="flex flex-col gap-y-5">
          <div class="text-3xl">
            Welcome back <b>{authStore().user?.username}</b>
          </div>

          <div class="h-2" />

          <div class="flex gap-x-5 items-center">
            <h1 class="text-3xl">Collations</h1>
            <button
              class="btn btn-ghost btn-sm5 border-2 border-gray-100"
              onClick={() => {
                // @ts-ignore
                document.getElementById("create-collation-modal").showModal();
              }}
            >
              + Create new collation
            </button>
          </div>
          <p>Here, you can manage the your receipt collations in one place.</p>
        </div>

        <div class="h-10" />

        <div class="flex gap-3">
          <For
            each={collationsQuery?.data ?? []}
            fallback={
              <div class="flex flex-col gap-y-2 items-center">
                <p>😭 No collations</p>
              </div>
            }
          >
            {(collation) => (
              <a
                href={`/collations/${collation.id}`}
                class="card border h-64 w-64 p-4 hover:shadow-xl transition flex flex-col gap-y-2"
              >
                <h3 class="text-base font-medium">{collation.name}</h3>
                <p class="badge badge-ghost">
                  PHP {format(collation.totalBudget, "0,0.00")}
                </p>
              </a>
            )}
          </For>
        </div>
      </main>

      <dialog
        id="create-collation-modal"
        class="modal modal-bottom sm:modal-middle"
      >
        <div class="modal-box">
          <h3 class="font-bold text-lg">New Receipt Collation</h3>

          <form id="create-new-collation" use:form={form}>
            <div class="form-control">
              <label class="label">
                <span class="label-text">Name</span>
              </label>
              <input
                name="name"
                type="text"
                placeholder="Engineering Team Cebu Trip"
                class="input input-bordered"
              />
            </div>
            <div class="form-control">
              <label class="label">
                <span class="label-text">Description</span>
              </label>
              <input
                name="description"
                type="text"
                placeholder="TPL Engineering Team going to Cebu in May 20-27"
                class="input input-bordered"
              />
            </div>
            <div class="form-control">
              <label class="label">
                <span class="label-text">Total Budget (PHP)</span>
              </label>
              <input
                name="totalBudget"
                type="number"
                placeholder="100000"
                class="input input-bordered"
              />
            </div>
          </form>
          <div class="modal-action">
            <button
              class="btn btn-primary"
              form="create-new-collation"
              type="submit"
            >
              Submit
            </button>
          </div>
        </div>
        <form method="dialog" class="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </Show>
  );
}
