import { IconAdd, IconRemove } from "@/components/icons";
import { hc } from "@/lib/honoClient";
import { createQuery } from "@tanstack/solid-query";
import {
  createMemo,
  createSignal,
  For,
  Index,
  Match,
  Switch,
  VoidProps,
} from "solid-js";

import { reporter, ValidationMessage } from "@felte/reporter-solid";
import { createForm } from "@felte/solid";
import { validator } from "@felte/validator-superstruct";
import { array, number, object, optional, string } from "superstruct";

import { toast } from "solid-sonner";
import Button from "../Button";
import AddNewReceiptSpenderModal, {
  openAddNewReceiptSpenderModal,
} from "./AddNewReceiptSpenderModal";
import Modal, { createModalOpeners } from "./Modal";

type AddNewReceiptModalProps = {
  collationId?: string;
  /** Add a refetch here if needed. */
  onSuccess?: () => void;
};
export default function AddNewReceiptModal(
  props: VoidProps<AddNewReceiptModalProps>
) {
  const FORM_TOASTID = "add-new-receipt-form-toast";

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
    image: object(),
  });

  const { form, data, addField, unsetField, setFields, isSubmitting } =
    createForm({
      extend: [
        reporter(),
        validator({ struct: addNewReceiptStruct, level: "error" }),
      ],
      onSubmit: async (values: typeof addNewReceiptStruct.TYPE, context) => {
        try {
          if (!props.collationId) return;

          const file = data("image") as unknown as File;

          // 1. Get the upload URL
          toast.loading("Getting Signed URL...", {
            id: FORM_TOASTID,
            duration: 10000,
          }); // 10 seconds

          console.log("GETTING UPLOAD URL.");

          const getSignedUrlResponse =
            await hc.collations.receipt.generateUploadUrl.$get({});

          const { uniqueId, signedUrl } = await getSignedUrlResponse.json();

          if (!signedUrl) throw new Error("No upload url.");

          // 2. POST to the upload URL
          toast.loading("Uploading Image...", {
            id: FORM_TOASTID,
            duration: 20000,
          }); // 20 seconds

          // ----- PUT approach (What works for BackBlaze) -----
          const fileUploadResponse = await fetch(signedUrl, {
            method: "PUT",
            body: file,
            headers: {
              "Content-Type": file.type,
            },
          });

          // 3. Add Receipt (Attach the imageObjectKey to request).
          // Since it's the last, use a promise for better animation with sonener
          toast.promise(
            async () => {
              const response = await hc.collations[
                ":collationId"
              ].receipts.$post({
                param: {
                  collationId: props.collationId!,
                },
                json: {
                  /** @ts-ignore */
                  imageObjKey: uniqueId, // TODO, this is a state and image upload returned by S3,
                  segmentedAmounts: values.segmentedAmounts,
                  totalAmount: values.totalAmount,
                },
              });

              if (!response.ok) {
                const error = await response.json();
                throw Error();
              }

              props.onSuccess?.();
              closeAddNewReceiptModal();
            },
            {
              id: FORM_TOASTID,
              duration: 1000,
              loading: "Adding Receipt...",
              success: "Added Receipt",
              error: "Failed to add Receipt. Please try again.",
            }
          );
        } catch (e) {
          console.log(e);
          toast.error("Something went wrong.", {
            duration: 1000,
            id: FORM_TOASTID,
          });
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
        id="add-new-receipt-modal"
        modalActions={
          <>
            <Button
              form="add-new-receipt-form"
              type="submit"
              isLoading={isSubmitting()}
            >
              Submit
            </Button>
          </>
        }
      >
        {/* <Button
          onClick={async () => {
            const promise = () =>
              new Promise((resolve) => setTimeout(resolve, 800));

            // toast.promise(promise, {
            //   loading: "Loading...",
            //   success: (data) => {
            //     return `toast has been added`;
            //   },
            //   error: "Error",
            // });

            toast.loading("Uploading...", { id: "form" });
            await promise();
            toast.promise(promise, {
              loading: "Saving...",
              success: (data) => {
                return `Toast has been added`;
              },
              error: "error",
              id: "form",
            });
          }}
        >
          Hea
        </Button> */}
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
                <ValidationMessage for="totalAmount">
                  {(messages) => (
                    <span class="text-error text-xs mt-0.5">
                      {messages?.[0]}
                    </span>
                  )}
                </ValidationMessage>
              </Match>

              <Match when={amountInputMode() === "segmented"}>
                <div class="flex flex-col w-full gap-y-1">
                  <Index each={segmentedAmounts()}>
                    {(_, index) => {
                      const spenderObject = createMemo(() =>
                        spendersQuery?.data?.spenders?.find(
                          (spender) =>
                            spender.id ===
                            data().segmentedAmounts?.at(index)?.spenderId
                        )
                      );

                      console.log("rerender me");

                      return (
                        <div class="w-full flex gap-x-2 items-center">
                          <div
                            class="rounded-full bg-gray-100 w-8 h-8 flex-shrink-0"
                            style={{
                              ...(!!spenderObject && {
                                "background-image": `url(${
                                  spenderObject()?.imageURL
                                })`,
                                "background-size": "cover",
                                "background-position": "center",
                              }),
                            }}
                          />
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

                          <input
                            name={`segmentedAmounts.${index}.amount`}
                            type="number"
                            placeholder="Amount (e.g. 500)"
                            class="input input-bordered w-full input-sm no-arrows"
                          />
                          <button
                            type="button"
                            class="flex-shrink"
                            onClick={() => removeSegmentedAmount(index)}
                          >
                            <IconRemove class="text-error" />
                          </button>
                        </div>
                      );
                    }}
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

          <div class="form-control w-full">
            <label class="label">
              <span class="label-text">Image</span>
            </label>
            <input
              name="image"
              type="file"
              class="file-input file-input-sm w-full file-input-bordered file-input-primary"
              accept="image/*"
            />
            <ValidationMessage for="image">
              {(messages) => (
                <span class="text-error text-xs mt-0.5">{messages?.[0]}</span>
              )}
            </ValidationMessage>
          </div>
        </form>
      </Modal>

      <AddNewReceiptSpenderModal
        collationId={props.collationId}
        onSuccess={() => spendersQuery?.refetch()}
      />
    </>
  );
}

export const { open: openAddNewReceiptModal, close: closeAddNewReceiptModal } =
  createModalOpeners("add-new-receipt-modal");
