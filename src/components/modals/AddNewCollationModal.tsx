import { createForm } from "@felte/solid";
import Button from "../Button";
import Modal, { createModalOpeners } from "./Modal";
import { number, object, optional, string } from "superstruct";
import { validator } from "@felte/validator-superstruct";
import { hc } from "@/lib/honoClient";
import { VoidProps } from "solid-js";

type AddNewCollationModalProps = {
  onSuccess?: () => void;
};

export default function AddNewCollationModal(
  props: VoidProps<AddNewCollationModalProps>
) {
  // ===========================================================================
  // Form State
  // ===========================================================================

  const struct = object({
    name: string(),
    description: optional(string()),
    totalBudget: number(),
  });

  const { form, isSubmitting } = createForm({
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

        props?.onSuccess?.();

        // @ts-ignore
        document.getElementById("create-collation-modal").close();
      } catch (e) {
        console.log("found an error here...");
      }
    },
  });

  return (
    <Modal
      id="create-collation-modal"
      modalActions={
        <Button
          class="btn btn-primary"
          form="create-new-collation-form"
          type="submit"
          isLoading={isSubmitting()}
        >
          Submit
        </Button>
      }
    >
      <h3 class="font-bold text-lg">New Receipt Collation</h3>

      <form id="create-new-collation-form" use:form={form}>
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
    </Modal>
  );
}

export const {
  open: openAddNewCollationModal,
  close: closeAddNewCollationModal,
} = createModalOpeners("create-collation-modal");
