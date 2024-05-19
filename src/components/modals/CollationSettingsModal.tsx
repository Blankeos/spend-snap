import {
  createEffect,
  createMemo,
  mergeProps,
  Show,
  VoidProps,
} from "solid-js";
import Modal, { createModalOpener, createModalOpeners } from "./Modal";
import { IconCopy } from "../icons";
import { toast } from "solid-sonner";
import Button from "../Button";
import { createQuery } from "@tanstack/solid-query";
import { hc } from "@/lib/honoClient";
import { createForm } from "@felte/solid";
import { reporter } from "@felte/reporter-solid";
import { validator } from "@felte/validator-superstruct";
import { boolean, number, object, optional, string } from "superstruct";

type CollationSettingsModal = {
  modalData: {
    collationId: string;
  } | null;
  onSuccess?: () => void;
  onClose?: () => void;
};

export default function CollationSettingsModal(
  props: VoidProps<CollationSettingsModal>
) {
  const defaultProps = mergeProps({ modalData: null }, props);

  const collationQuery = createQuery(() => ({
    queryKey: ["collation-details-page"],
    queryFn: async () => {
      try {
        const response = await hc.collations[":collationId"].$get({
          param: { collationId: defaultProps?.modalData?.collationId! },
        });
        return await response?.json();
      } catch (e) {
        return null;
      }
    },
    enabled: !!defaultProps.modalData?.collationId,
    staleTime: Infinity,
  }));

  // ===========================================================================
  // Form State
  // ===========================================================================
  const collationSettingsFormStruct = object({
    public: optional(boolean()),
    name: optional(string()),
    description: optional(string()),
    totalBudget: optional(number()),
  });
  const { form, data, setFields, reset } = createForm({
    extend: [
      reporter(),
      validator({ struct: collationSettingsFormStruct, level: "error" }),
    ],
    onSubmit: async (
      values: typeof collationSettingsFormStruct.TYPE,
      context
    ) => {
      try {
        hc.collations[":collationId"].$post({
          param: { collationId: defaultProps.modalData?.collationId! },
          json: {
            name: values.name,
            description: values.description,
            public: values.public,
            totalBudget: values.totalBudget,
          },
        });
      } catch (e) {
        // toast.error("Something went wrong.", {
        //   duration: 1000,
        // });
      }
    },
  });

  // ===========================================================================
  // Effects
  // ===========================================================================

  // On Modal Open
  createEffect(() => {
    if (defaultProps.modalData === null || !collationQuery.data) return;

    setFields({
      name: collationQuery.data.name,
      description: collationQuery.data.description,
      public: collationQuery.data.public,
      totalBudget: collationQuery.data.totalBudget,
    });
  });

  // On Modal Close
  createEffect(() => {
    if (defaultProps.modalData !== null) return;
    reset();
  });

  const hasBeenModified = createMemo(() => {
    if (!collationQuery.data) return false;

    if (collationQuery.data.name !== data("name")) return true;
    if (collationQuery.data.description !== data("description")) return true;
    if (collationQuery.data.public !== data("public")) return true;
    if (collationQuery.data.totalBudget !== data("totalBudget")) return true;

    return false;
  });

  return (
    <Modal
      isOpen={!!defaultProps.modalData}
      id="collation-settings-modal"
      modalActions={
        <Button disabled={!hasBeenModified()}>
          {hasBeenModified() ? "Save Changes" : "Not Modified"}
        </Button>
      }
      onCloseClick={props.onClose}
    >
      <h1 class="font-bold">Collation Settings</h1>

      <form use:form={form}>
        <div class="form-control">
          <label class="label cursor-pointer flex justify-start gap-x-2">
            <input
              type="checkbox"
              class="toggle toggle-primary"
              checked
              name="public"
            />
            <span class="label-text">Public</span>
          </label>
        </div>

        <Show when={data("public") === true}>
          <div class="flex items-center gap-x-2">
            <button
              onClick={() => {
                toast.success("Copied!", { duration: 900 });
                navigator.clipboard.writeText(
                  `${window.location.origin}/collations/${collationQuery.data?.id}`
                );
              }}
            >
              <IconCopy class="text-primary" />
            </button>
            <div>
              <p class="mt-4">Shareable Link</p>
              <p class="text-xs text-gray-500">
                {`${window.location.origin}/collations/${collationQuery.data?.id}`}
              </p>
            </div>
          </div>
        </Show>

        <div class="h-3" />

        <div class="flex flex-col">
          <label class="label">
            <span class="label-text font-medium">Name</span>
          </label>
          <input
            name="name"
            placeholder="Name"
            class="input input-bordered input-sm"
          />
        </div>

        <div class="flex flex-col">
          <label class="label">
            <span class="label-text font-medium">Description</span>
          </label>
          <textarea
            name="description"
            placeholder="Description"
            class="textarea textarea-sm textarea-bordered h-24"
          />
        </div>

        <div class="flex flex-col">
          <label class="label">
            <span class="label-text font-medium">Total Budget</span>
          </label>
          <input
            name="totalBudget"
            type="number"
            placeholder="Amount (e.g. 500)"
            class="input input-bordered no-arrows input-sm"
          />
        </div>
      </form>
    </Modal>
  );
}

export const createCollationSettingsModalOpener = () => {
  const { modalData, openModal, closeModal } =
    createModalOpener<CollationSettingsModal["modalData"]>(null);

  return {
    collationSettingsModalData: modalData,
    openCollationSettingsModal: openModal,
    closeCollationSettingsModal: closeModal,
  };
};
