import { hc } from "@/lib/honoClient";
import { createForm } from "@felte/solid";
import { validator } from "@felte/validator-superstruct";
import {
  createSignal,
  FlowProps,
  For,
  Index,
  Match,
  Switch,
  VoidProps,
} from "solid-js";
import { array, number, object, optional, string } from "superstruct";
import Modal from "./Modal";

import IconAdd from "~icons/mdi/plus";
import IconRemove from "~icons/mdi/close-box";
import { createQuery } from "@tanstack/solid-query";
import AddNewReceiptSpenderModal, {
  openAddNewReceiptSpenderModal,
} from "./AddNewReceiptSpenderModal";

type AddNewReceiptModalProps = {
  collationId?: string;
};
export default function AddNewReceiptModal(
  props: VoidProps<AddNewReceiptModalProps>
) {
  // ===========================================================================
  // States
  // ===========================================================================

  const [amountInputMode, setAmountInputMode] = createSignal<
    "segmented" | "totalAmount"
  >("totalAmount");

  // ===========================================================================
  // Queries
  // ===========================================================================
  const spendersQuery = createQuery(() => ({
    queryKey: ["receipt-spenders"],
    queryFn: async () => {
      try {
        const response = await hc.collations[":collationId"].spenders.$get({
          param: {
            collationId: props.collationId!,
          },
        });

        const result = await response?.json();

        return result;
      } catch (e) {
        return null;
      }
    },
    enabled: !!props.collationId,
  }));

  // ===========================================================================
  // Form State
  // ===========================================================================

  const addNewReceiptStruct = object({
    segmentedAmounts: optional(
      array(
        object({
          spenderId: string(),
          amount: number(),
        })
      )
    ),
    totalAmount: optional(number()),
  });

  const { form, data, addField, unsetField, setFields } = createForm({
    extend: validator({ struct: addNewReceiptStruct, level: "error" }),
    onSubmit: async (values: typeof addNewReceiptStruct.TYPE, context) => {
      try {
        if (!props.collationId) return;

        const response = await hc.collations[":collationId"].receipt.$post({
          param: {
            collationId: props.collationId,
          },
          json: {
            imageObjKey: "", // TODO, this is a state and image upload returned by S3,
            segmentedAmounts: values.segmentedAmounts,
            totalAmount: values.totalAmount,
          },
        });

        const result = await response?.json();

        // @ts-ignore
        document.getElementById("create-collation-modal").close();
      } catch (e) {
        console.log("found an error here...");
      }
    },
  });

  // Dynamic Array Field
  const segmentedAmounts = () => data("segmentedAmounts");

  function removeSegmentedAmount(index: number) {
    unsetField(`segmentedAmounts.${index}`);
  }

  function addSegmentedAmount(index: number) {
    addField(
      `segmentedAmounts`,
      {
        spenderId: undefined,
        amount: undefined,
      },
      index
    );
  }

  return (
    <>
      <Modal
        id="create-collation-modal"
        modalActions={
          <>
            <button
              class="btn btn-primary"
              form="add-new-receipt-form"
              type="submit"
            >
              Submit
            </button>
          </>
        }
      >
        <h3 class="font-bold text-lg">Add New Receipt</h3>

        <form id="add-new-receipt-form" use:form={form}>
          <div class="form-control">
            <label class="label">
              <span class="label-text">Receipt Amount (PHP)</span>
            </label>

            <div role="tablist" class="tabs tabs-boxed mb-2">
              <a
                role="tab"
                class={`tab h-full ${
                  amountInputMode() === "totalAmount" ? "tab-active" : ""
                }`}
                onClick={() => setAmountInputMode("totalAmount")}
              >
                <span class="flex flex-col gap-y-1 py-2">
                  <span class="leading-4">Total Amount</span>
                  <span class="text-xs opacity-50">No spender tracking</span>
                </span>
              </a>
              <a
                role="tab"
                class={`tab h-full ${
                  amountInputMode() === "segmented" ? "tab-active" : ""
                }`}
                onClick={() => setAmountInputMode("segmented")}
              >
                <span class="flex flex-col gap-y-1 py-2">
                  <span class="leading-4">Segmented Amount</span>
                  <span class="text-xs opacity-50">Track by spender</span>
                </span>
              </a>
            </div>

            <Switch>
              <Match when={amountInputMode() === "totalAmount"}>
                <input
                  name="totalAmount"
                  type="number"
                  placeholder="Amount (e.g. 500)"
                  class="input input-bordered input-sm"
                />
              </Match>

              <Match when={amountInputMode() === "segmented"}>
                <div class="flex flex-col w-full gap-y-1">
                  <Index each={segmentedAmounts()}>
                    {(_, index) => (
                      <div class="flex gap-x-1 w-full">
                        <div class="w-full flex gap-x-2 items-center">
                          <div class="rounded-full bg-gray-100 w-8 h-8 flex-shrink-0" />
                          <select
                            name={`segmentedAmounts.${index}.spenderId`}
                            class="select select-sm select-primary w-full max-w-xs"
                            onChange={(e) => {
                              if (e.currentTarget.value === "new-spender") {
                                openAddNewReceiptSpenderModal();

                                setFields(
                                  `segmentedAmounts.${index}.spenderId`,
                                  undefined
                                );
                              }
                            }}
                          >
                            <option disabled value={undefined}>
                              Pick a spender
                            </option>

                            <For each={spendersQuery?.data?.spenders ?? []}>
                              {(spender) => (
                                <option value={spender.id}>
                                  {spender.name}
                                </option>
                              )}
                            </For>

                            <option value="new-spender">
                              [ + Add New Spender ]
                            </option>
                          </select>
                        </div>

                        <input
                          name={`segmentedAmounts.${index}.amount`}
                          type="text"
                          placeholder="Amount (e.g. 500)"
                          class="input input-bordered w-full input-sm"
                        />
                        <button
                          type="button"
                          class="flex-shrink"
                          onClick={() => removeSegmentedAmount(index)}
                        >
                          <IconRemove class="text-error" />
                        </button>
                      </div>
                    )}
                  </Index>
                  <button
                    type="button"
                    class="btn btn-ghost btn-sm border border-gray-200 font-normal"
                    onClick={() => {
                      if (segmentedAmounts() === undefined) {
                        addSegmentedAmount(0);
                        return;
                      }

                      addSegmentedAmount(segmentedAmounts()!.length);
                    }}
                  >
                    <IconAdd class="text-gray-600" /> New Segmented Amount
                  </button>
                </div>
              </Match>
            </Switch>
          </div>

          <div class="form-control">
            <label class="label">
              <span class="label-text">Image</span>
            </label>
            <input
              type="file"
              class="file-input file-input-sm w-full max-w-xs file-input-bordered"
            />
          </div>
        </form>
      </Modal>

      <AddNewReceiptSpenderModal collationId={props.collationId} />
    </>
  );
}

export const openAddNewReceiptModal = () => {
  // @ts-ignore
  document.getElementById("create-collation-modal")!.showModal();
};

export const closeAddNewReceiptModal = () => {
  // @ts-ignore
  document.getElementById("create-collation-modal")!.close();
};
