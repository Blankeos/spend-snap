import Button from "@/components/Button";
import AddNewCollationModal, {
  openAddNewCollationModal,
} from "@/components/modals/AddNewCollationModal";
import Modal from "@/components/modals/Modal";
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
                openAddNewCollationModal();
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

      <AddNewCollationModal onSuccess={() => collationsQuery.refetch()} />
    </Show>
  );
}
