import { cn } from "@/lib/cn";
import { createSignal, FlowProps, JSXElement, Show } from "solid-js";

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
   *
   * This is recommend especially when rendering toasts in dialog. Because
   * dialog has a bug with Z-Index: github.com/saadeghi/daisyui/issues/2858
   */
  isOpen?: boolean;

  /**
   * Callback when the close or outside (modal-backdrop) is clicked.
   */
  onCloseClick?: () => void;
};

export default function Modal(props: FlowProps<ModalProps>) {
  return (
    <dialog
      id={props.id}
      class={cn(
        "modal modal-bottom sm:modal-middle",
        props.class,
        props.isOpen && "modal-open"
      )}
    >
      <div class="modal-box">
        {props.children}
        <Show when={props.modalActions}>
          <div class="modal-action">{props.modalActions}</div>
        </Show>
      </div>
      <form method="dialog" class="modal-backdrop" onClick={props.onCloseClick}>
        <button>close</button>
      </form>
    </dialog>
  );
}

/** Use for complex cases, like an edit form modal with default values. */
export function createModalOpener<T>(modalData: T) {
  const [_modalData, _setModalData] = createSignal<T | null>(modalData);

  function openModal(modalData: T) {
    _setModalData((_) => modalData);
  }

  function closeModal() {
    _setModalData(null);
  }

  return {
    modalData: _modalData,
    openModal,
    closeModal,
  };
}

/** Use for simple cases. */
export function createModalOpeners(id: string) {
  return {
    // @ts-ignore
    open: (): void => document?.getElementById(id)?.showModal(),
    // @ts-ignore
    close: (): void => document?.getElementById(id)?.close(),
  };
}
