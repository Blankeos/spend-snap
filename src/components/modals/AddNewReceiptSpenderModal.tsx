import { hc } from "@/lib/honoClient";
import { createForm } from "@felte/solid";
import { validator } from "@felte/validator-superstruct";
import { VoidProps } from "solid-js";
import { object, optional, string } from "superstruct";
import Modal from "./Modal";
import Button from "../Button";

type AddNewReceiptSpenderModalProps = {
  collationId?: string;
  onSuccess?: () => void;
};

export default function AddNewReceiptSpenderModal(
  props: VoidProps<AddNewReceiptSpenderModalProps>
) {
  const addNewReceiptStruct = object({
    name: string(),
    imageURL: optional(string()),
  });

  const { form, data } = createForm({
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

        // @ts-ignore
        document.getElementById("create-collation-modal").close();
      } catch (e) {
        console.log("found an error here...");
      }
    },
  });

  return (
    <Modal
      id="new-spender-modal"
      modalActions={<Button isLoading>Submit</Button>}
    >
      <form use:form={form}>
        <h3 class="font-bold text-lg">New Spender</h3>

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

export function openAddNewReceiptSpenderModal() {
  // @ts-ignore
  document.getElementById("new-spender-modal")?.showModal();
}

export function closeAddNewReceiptModal() {
  // @ts-ignore
  document.getElementById("new-spender-modal")?.close();
}
