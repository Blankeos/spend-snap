import { $user } from "@/contexts/authStore";
import { useProtectedRoute } from "@/hooks/useProtectedRoute";
import { hc } from "@/lib/honoClient";
import { useStore } from "@nanostores/solid";
import { onMount, Show } from "solid-js";
import { createQuery } from "@tanstack/solid-query";
import { usePageContext } from "vike-solid/usePageContext";
import Chart from "chart.js/auto";

export default function DashboardPage() {
  useProtectedRoute({ redirectTo: "/" });
  const authStore = useStore($user);

  const { routeParams } = usePageContext();

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
  // Effects
  // ===========================================================================
  let canvas: HTMLCanvasElement | undefined;

  onMount(() => {
    const ctx = canvas?.getContext("2d")!;
    if (!ctx) return;

    const myChart = new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
        datasets: [
          {
            label: "# of Votes",
            data: [12, 19, 3, 5, 2, 3],
            backgroundColor: [
              "rgba(255, 99, 132, 0.2)",
              "rgba(54, 162, 235, 0.2)",
              "rgba(255, 206, 86, 0.2)",
              "rgba(75, 192, 192, 0.2)",
              "rgba(153, 102, 255, 0.2)",
              "rgba(255, 159, 64, 0.2)",
            ],
            borderColor: [
              "rgba(255, 99, 132, 1)",
              "rgba(54, 162, 235, 1)",
              "rgba(255, 206, 86, 1)",
              "rgba(75, 192, 192, 1)",
              "rgba(153, 102, 255, 1)",
              "rgba(255, 159, 64, 1)",
            ],
            borderWidth: 1,
          },
        ],
      },
    });
  });

  return (
    <Show when={authStore().user} fallback="Not authenticated.">
      <div class="max-w-5xl mx-auto px-8">
        <h1 class="text-2xl">{collationDetailsQuery?.data?.name}</h1>
        {JSON.stringify(collationDetailsQuery.data)}

        <canvas ref={canvas} class="w-20 h-20" />
      </div>
    </Show>
  );
}
