import Protected from "@/components/hoc/Protected";
import ShowWhenAuthenticated from "@/components/hoc/ShowWhenAuthenticated";
import AddNewReceiptModal, {
  openAddNewReceiptModal,
} from "@/components/modals/AddNewReceiptModal";
import Table from "@/components/Table";
import { createSpring } from "@/hooks/createSpring";
import { formatCurrency } from "@/lib/formatCurrency";
import { formatDate } from "@/lib/formatDate";
import { hc } from "@/lib/honoClient";
import createTween from "@solid-primitives/tween";
import { createQuery } from "@tanstack/solid-query";
import { createEffect, createMemo, createSignal, on, Show } from "solid-js";
import { usePageContext } from "vike-solid/usePageContext";
import { IconAdd, IconLoading } from "@/components/icons";
import Button from "@/components/Button";
import { createStore } from "solid-js/store";

export default function CollationDetailsPage() {
  const { routeParams } = usePageContext();

  // ===========================================================================
  // States
  // ===========================================================================
  const [viewImageModalData, setViewImageModalData] = createSignal<{
    imageUrl: string;
  } | null>(null);

  const [paginatedStore, setPaginatedStore] = createStore({
    pageSize: 5,
    currentPage: 0,
    hasNext: true,
    hasPrevious: false,
  });

  // ===========================================================================
  // Queries
  // ===========================================================================
  const collationQuery = createQuery(() => ({
    queryKey: ["collation-details-page"],
    queryFn: async () => {
      try {
        const response = await hc.collations[":collationId"].$get({
          param: { collationId: routeParams!["collationId"] },
        });
        return await response?.json();
      } catch (e) {
        return null;
      }
    },
    enabled: !!routeParams?.["collationId"],
  }));

  const totalSpentQuery = createQuery(() => ({
    queryKey: ["collation-details-page-total-spent"],
    queryFn: async () => {
      try {
        const response = await hc.collations[
          ":collationId"
        ].receipt.totalSpent.$get({
          param: { collationId: routeParams!["collationId"] },
        });
        return await response?.json();
      } catch (e) {
        return null;
      }
    },
    enabled: !!routeParams?.["collationId"],
  }));

  const paginatedReceiptsQuery = createQuery(() => ({
    queryKey: [
      "collation-details-page-receipts",
      paginatedStore.currentPage,
      paginatedStore.pageSize,
    ],
    queryFn: async () => {
      try {
        const response = await hc.collations[":collationId"].receipts.$get({
          param: { collationId: routeParams!["collationId"] },
          query: {
            page: paginatedStore.currentPage.toString(),
            limit: paginatedStore.pageSize.toString(),
          },
        });

        return await response?.json();
      } catch (e) {
        return null;
      }
    },
    enabled: !!routeParams?.["collationId"],
  }));

  // ===========================================================================
  // Derived States
  // ===========================================================================

  const totalSpent = createMemo(() => totalSpentQuery?.data?.totalSpent ?? 0);

  const totalBudget = createMemo(() => collationQuery?.data?.totalBudget ?? 0);

  const spentPercentage = createMemo(() => {
    if (!collationQuery?.data?.totalBudget || !totalSpent()) return 0;

    return (totalSpent() / collationQuery?.data?.totalBudget) * 100;
  });

  const [springedSpentPercentage, setSpringedSpentPercentage] = createSpring(
    0,
    { stiffness: 0.03, damping: 0.3 }
  );

  // ===========================================================================
  // Effects
  // ===========================================================================

  // After the query totalSpent and totalBudget are available, animate the progress bar
  createEffect(
    on([totalSpent, totalBudget], () => {
      const percent = (totalSpent() / totalBudget()) * 100 || 0; // Fallback to 0 when NaN (divide by 0)
      setSpringedSpentPercentage(percent);
    })
  );

  // After the paginatedQueryResponse is available.
  createEffect(() => {
    if (!paginatedReceiptsQuery.data?.receipts?.length) {
      setPaginatedStore("hasNext", (hasNext) => false);

      if (paginatedStore.currentPage > 0)
        setPaginatedStore("hasPrevious", (hasPrevious) => true);
    } else {
      setPaginatedStore("hasNext", (hasNext) => true);
    }

    if (paginatedStore.currentPage <= 0)
      setPaginatedStore("hasPrevious", (hasPrevious) => false);
  });

  return (
    <>
      <div class="max-w-5xl mx-auto px-8 py-6">
        <header class="flex flex-col gap-y-2">
          <h1 class="text-2xl">
            <b class="font-bold">Collation:</b>
            {collationQuery?.data?.name}
          </h1>

          <p class="text-gray-600">
            <b class="font-medium">Description:</b>{" "}
            {collationQuery.data?.description}
          </p>
          <span class="badge badge-ghost text-xs">
            Created:{" "}
            {collationQuery.data?.createdTimestamp &&
              formatDate(collationQuery.data?.createdTimestamp)}
          </span>
        </header>
        <div class="h-5" />

        {/* Radial Percent */}
        <div class="flex flex-col items-center justify-center gap-y-3">
          <div
            class="w-52 h-52 rounded-full grid place-items-center"
            style={{
              background: `conic-gradient(lightgreen ${springedSpentPercentage()}%, rgb(229, 231, 235) 0%)`,
            }}
          >
            <div class="w-40 h-40 bg-white rounded-full shadow-lg border grid place-items-center">
              <Show
                when={!totalSpentQuery.isLoading}
                fallback={<IconLoading font-size="2.5rem" class="opacity-70" />}
              >
                <span class="text-2xl">
                  {springedSpentPercentage().toFixed(2)}%
                </span>
              </Show>
            </div>
          </div>

          <p>
            Spent: {formatCurrency(totalSpent())} /{" "}
            {formatCurrency(totalBudget())}
          </p>
        </div>
        <div class="h-5" />

        <Show when={false}>
          <div class="flex gap-x-2 justify-center">
            <button class="btn" onClick={() => setSpringedSpentPercentage(0)}>
              0%
            </button>
            <button class="btn" onClick={() => setSpringedSpentPercentage(25)}>
              25%
            </button>
            <button class="btn" onClick={() => setSpringedSpentPercentage(50)}>
              50%
            </button>
            <button class="btn" onClick={() => setSpringedSpentPercentage(95)}>
              95%
            </button>
          </div>
        </Show>

        <div class="h-5" />

        <div class="flex gap-x-3 items-center">
          <h2 class="text-lg font-bold">Receipts</h2>
          <button
            class="btn btn-xs border btn-ghost border-gray-200 flex gap-x-1"
            onClick={() => {
              openAddNewReceiptModal();
            }}
          >
            <IconAdd class="text-gray-600" />
            <span>Add New</span>
          </button>
        </div>

        {/* {JSON.stringify(paginatedStore)} */}
        <Table
          data={paginatedReceiptsQuery?.data?.receipts ?? []}
          isLoading={paginatedReceiptsQuery?.isFetching}
          columns={[
            {
              header: "Date Logged",
              cell(props) {
                return formatDate(
                  props.row.original?.createdTimestamp ?? new Date()
                );
              },
            },
            {
              header: "Total Amount",
              cell(props) {
                return formatCurrency(props.row.original?.totalAmount ?? 0);
              },
            },
            // {
            //   header: "Image",
            //   cell(props) {
            //     return (
            //       <button
            //         class="btn btn-xs border btn-ghost border-gray-200"
            //         onClick={() => {
            //           setViewImageModalData({
            //             imageUrl: props.row.original.imageUrl,
            //           });

            //           // @ts-ignore
            //           document.getElementById("view-image-modal")!.showModal();
            //         }}
            //       >
            //         <span class="flex gap-x-1">
            //           <IconImage class="text-gray-600" />
            //           <span class="truncate">View Image</span>
            //         </span>
            //       </button>
            //     );
            //   },
            // },
          ]}
          currentPage={paginatedStore.currentPage}
          hasPrevious={paginatedStore.hasPrevious ?? false}
          hasNext={paginatedStore.hasNext ?? true}
          onNext={() => {
            setPaginatedStore("currentPage", (currentPage) => currentPage + 1);
          }}
          onPrev={() => {
            if (paginatedStore.currentPage <= 0) return;
            setPaginatedStore("currentPage", (currentPage) => currentPage - 1);
          }}
        />
      </div>

      {/* MODALS */}
      <dialog id="view-image-modal" class="modal modal-bottom sm:modal-middle">
        <div class="modal-box">
          <img
            src={viewImageModalData()?.imageUrl}
            alt="receipt preview"
            class="h-full w-full"
          />
        </div>
        <form method="dialog" class="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>

      <ShowWhenAuthenticated>
        <AddNewReceiptModal
          collationId={routeParams?.["collationId"]}
          onSuccess={() => {
            collationQuery?.refetch();
            totalSpentQuery?.refetch();
          }}
        />
      </ShowWhenAuthenticated>
    </>
  );
}
