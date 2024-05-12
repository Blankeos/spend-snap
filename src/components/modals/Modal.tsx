import { cn } from "@/lib/cn";
import { FlowProps, JSXElement, Show } from "solid-js";

type ModalProps = {
  id: string;
  /**
   * The actions below the modal. Render buttons here.
   */
  modalActions?: JSXElement;

  /**
   * Addtiional <dialog> classes.
   *
   * @default
   * "modal modal-bottom sm:modal-middle"
   */
  class?: string;

  /**
   * Apart from the document.getElementById().showModal and .close(),
   * this directly attaches the class that makes this open.
   */
  forceOpen?: boolean;
};

export default function Modal(props: FlowProps<ModalProps>) {
  return (
    <dialog
      id={props.id}
      class={cn(
        "modal modal-bottom sm:modal-middle",
        props.class,
        props.forceOpen && "modal-open"
      )}
    >
      <div class="modal-box">
        {props.children}
        <Show when={props.modalActions}>
          <div class="modal-action">{props.modalActions}</div>
        </Show>
      </div>
      <form method="dialog" class="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
}

export function createModalOpeners(id: string) {
  return {
    // @ts-ignore
    open: (): void => document?.getElementById(id)?.showModal(),
    // @ts-ignore
    close: (): void => document?.getElementById(id)?.close(),
  };
}
