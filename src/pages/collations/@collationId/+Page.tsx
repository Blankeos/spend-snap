import Table from "@/components/Table";
import { $user } from "@/contexts/authStore";
import { useProtectedRoute } from "@/hooks/useProtectedRoute";
import { formatCurrency } from "@/lib/formatCurrency";
import { formatDate } from "@/lib/formatDate";
import { hc } from "@/lib/honoClient";
import { useStore } from "@nanostores/solid";
import createTween from "@solid-primitives/tween";
import { createQuery } from "@tanstack/solid-query";
import { createMemo, createSignal, onMount, Show } from "solid-js";
import { usePageContext } from "vike-solid/usePageContext";
import IconImage from "~icons/mdi/tooltip-image";

export default function CollationDetailsPage() {
  useProtectedRoute({ redirectTo: "/" });
  const authStore = useStore($user);

  const { routeParams } = usePageContext();

  const [amountSpent, setAmountSpent] = createSignal(0);

  // ===========================================================================
  // Queries
  // ===========================================================================
  const collationDetailsQuery = createQuery(() => ({
    queryKey: ["collation-details-page"],
    queryFn: async () => {
      try {
        const response = await hc.collations[":collationId"].$get({
          param: {
            collationId: routeParams!["collationId"],
          },
        });
        return await response?.json();
      } catch (e) {
        return null;
      }
    },
    enabled: !!authStore().user && !!routeParams?.["collationId"],
  }));

  // ===========================================================================
  // Derived States
  // ===========================================================================

  const totalBudget = createMemo(
    () => collationDetailsQuery?.data?.totalBudget ?? 0
  );

  const spentPercentage = createMemo(() => {
    if (!collationDetailsQuery?.data?.totalBudget || !amountSpent()) return 0;

    return (amountSpent() / collationDetailsQuery?.data?.totalBudget) * 100;
  });

  const tweenedSpentPercentage = createTween(spentPercentage, {
    duration: 500,
  });

  return (
    <Show when={authStore().user} fallback="Not authenticated.">
      <div class="max-w-5xl mx-auto px-8">
        <div class="h-5" />

        <header class="flex flex-col gap-y-2">
          <h1 class="text-2xl">
            <b class="font-bold">Collation:</b>{" "}
            {collationDetailsQuery?.data?.name}
          </h1>
          {/* {JSON.stringify(collationDetailsQuery.data)} */}
          <p class="text-gray-600">
            <b class="font-medium">Description:</b>{" "}
            {collationDetailsQuery.data?.description}
          </p>
          <span class="badge badge-ghost text-xs">
            Created:{" "}
            {collationDetailsQuery.data?.createdTimestamp &&
              formatDate(collationDetailsQuery.data?.createdTimestamp)}
          </span>
        </header>

        <div class="h-5" />

        <div class="flex flex-col items-center justify-center gap-y-3">
          <div
            class="w-52 h-52 rounded-full grid place-items-center"
            style={{
              background: `conic-gradient(lightgreen ${tweenedSpentPercentage()}%, rgb(229, 231, 235) 0%)`,
            }}
          >
            <div class="w-40 h-40 bg-white rounded-full shadow-lg border grid place-items-center">
              <span class="text-2xl">
                {tweenedSpentPercentage().toFixed(2)}%
              </span>
            </div>
          </div>

          <p>
            Spent: {formatCurrency(amountSpent())} /{" "}
            {formatCurrency(totalBudget())}
          </p>
        </div>

        <div class="h-5" />

        <div class="flex gap-x-2 justify-center">
          <button
            class="btn"
            onClick={() => setAmountSpent(totalBudget() * 0.25)}
          >
            25%
          </button>
          <button
            class="btn"
            onClick={() => setAmountSpent(totalBudget() * 0.5)}
          >
            50%
          </button>
          <button
            class="btn"
            onClick={() => setAmountSpent(totalBudget() * 0.95)}
          >
            95%
          </button>
        </div>

        <div class="h-5" />

        <h2 class="text-lg font-bold">Receipts</h2>

        <Table
          columns={[
            {
              header: "Date Logged",
              cell(props) {
                return formatDate(props.row.original.date);
              },
            },
            {
              header: "Total Spent",
              cell(props) {
                return formatCurrency(props.row.original.amount);
              },
            },
            {
              header: "Image",
              cell(props) {
                return (
                  <button class="btn btn-ghost btn-xs border border-gray-200 truncate">
                    <IconImage class="text-gray-600" /> View Image
                  </button>
                );
              },
            },
          ]}
          data={[
            {
              amount: 100,
              date: "2024-01-01",
              imageUrl: "https://myimage.com/123.png",
            },
            {
              amount: 300,
              date: "2022-01-01",
              imageUrl: "https://myimage.com/123.png",
            },
          ]}
        />
      </div>
    </Show>
  );
}
