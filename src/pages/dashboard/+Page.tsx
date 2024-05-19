import AddNewCollationModal, {
  openAddNewCollationModal,
} from "@/components/modals/AddNewCollationModal";
import { $user } from "@/contexts/authStore";
import { getRandomIllustration } from "@/lib/randomizers/getRandomIllustration";
import { hc } from "@/lib/honoClient";
import { useStore } from "@nanostores/solid";
import { createQuery } from "@tanstack/solid-query";
import { format } from "numerable";
import { For, Show } from "solid-js";
import Protected from "@/components/hoc/Protected";

export default function DashboardPage() {
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
    enabled: !!authStore().user,
  }));

  return (
    <Protected>
      <main class="mx-auto max-w-5xl px-7 py-12">
        <div class="flex flex-col gap-y-5">
          <div class="text-3xl">
            👋 Welcome back <b>{authStore().user?.username}!</b>
          </div>

          <div class="h-2" />

          <div class="flex gap-x-5 items-center">
            <h1 class="text-3xl">Your Collations</h1>
            <button
              class="btn btn-ghost btn-sm5 border-2 border-gray-100"
              onClick={() => {
                openAddNewCollationModal();
              }}
            >
              + Create new collation
            </button>
          </div>
          <p class="text-gray-500">
            Each <span class="font-semibold">collation</span> is like a folder
            of the receipts you tracked for a specific occasion.
          </p>
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
                class="relative card border h-64 w-64 p-4 hover:shadow-xl transition flex flex-col gap-y-2 overflow-hidden hover:bg-primary/5"
              >
                <h3 class="text-base font-medium">{collation.name}</h3>
                <p class="badge badge-ghost">
                  PHP {format(collation.totalBudget, "0,0.00")}
                </p>

                <img
                  src={getRandomIllustration(collation.id)}
                  class="absolute -bottom-16 -right-16 opacity-20 grayscale"
                />
              </a>
            )}
          </For>
        </div>
      </main>

      <AddNewCollationModal onSuccess={() => collationsQuery.refetch()} />
    </Protected>
  );
}
