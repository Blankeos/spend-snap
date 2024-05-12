import { hc } from "@/lib/honoClient";
import { createForm } from "@felte/solid";
import { validator } from "@felte/validator-superstruct";
import {
  createEffect,
  createSignal,
  Match,
  Show,
  Switch,
  VoidProps,
} from "solid-js";
import { object, optional, string } from "superstruct";
import Modal, { createModalOpeners } from "./Modal";
import Button from "../Button";
import IconProfileDefault from "~icons/material-symbols/account-circle";

type AddNewReceiptSpenderModalProps = {
  collationId?: string;
  onSuccess?: () => void;
};

export default function AddNewReceiptSpenderModal(
  props: VoidProps<AddNewReceiptSpenderModalProps>
) {
  const [imageExists, setImageHasLoaded] = createSignal(false);

  // ===========================================================================
  // Form States
  // ===========================================================================
  const addNewReceiptStruct = object({
    name: string(),
    imageURL: optional(string()),
  });

  const { form, isSubmitting, data } = createForm({
    extend: validator({ struct: addNewReceiptStruct, level: "error" }),
    onSubmit: async (values: typeof addNewReceiptStruct.TYPE, context) => {
      try {
        if (!props.collationId) return;

        const response = await hc.collations[":collationId"].spenders.$post({
          param: {
            collationId: props.collationId,
          },
          json: {
            name: values.name,
            imageURL: values.imageURL,
          },
        });

        const result = await response?.json();

        props?.onSuccess?.();
        closeAddNewReceiptModal();
        console.log("shouldve closed by now");
      } catch (e) {
        console.log("found an error here...", e);
      }
    },
  });

  return (
    <Modal
      id="new-spender-modal"
      modalActions={
        <Button form="new-spender-modal-form" isLoading={isSubmitting()}>
          Submit
        </Button>
      }
    >
      <form use:form={form} id="new-spender-modal-form">
        <h3 class="font-bold text-lg">New Spender</h3>

        <div class="h-2" />
        <div class="flex items-start justify-start">
          {/* Image */}
          <div class="shadow relative overflow-hidden rounded-full bg-gray-200 w-20 h-20 grid place-items-center">
            <img
              class="absolute inset-0 object-cover w-full h-full"
              src={data().imageURL}
              onload={() => setImageHasLoaded((_) => true)}
              onerror={() => setImageHasLoaded((_) => false)}
            />
            <Show when={!imageExists()}>
              <IconProfileDefault class="opacity-20" font-size="2rem" />
            </Show>
          </div>
        </div>

        <div class="form-control">
          <label class="label">
            <span class="label-text">Name</span>
          </label>
          <input
            type="text"
            name="name"
            class="input input-bordered input-sm"
            placeholder="Carlo"
          />
        </div>

        <div class="form-control">
          <label class="label">
            <span class="label-text">Image URL</span>
          </label>
          <input
            type="text"
            name="imageURL"
            class="input input-bordered input-sm"
            placeholder="https://example.com/my-image.png"
          />
        </div>
      </form>
    </Modal>
  );
}

export const {
  open: openAddNewReceiptSpenderModal,
  close: closeAddNewReceiptModal,
} = createModalOpeners("new-spender-modal");
