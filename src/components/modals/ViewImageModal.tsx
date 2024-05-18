import { Show, VoidProps } from "solid-js";
import Modal, { createModalOpeners } from "./Modal";
import { createQuery } from "@tanstack/solid-query";
import { hc } from "@/lib/honoClient";
import { IconLoading } from "../icons";

type ViewImageModalProps = {
  imgObjectKey?: string;
};

export default function ViewImageModal(props: VoidProps<ViewImageModalProps>) {
  const receiptImageUrlQuery = createQuery(() => ({
    queryKey: ["view-image-modal", props.imgObjectKey],
    queryFn: async () => {
      try {
        const response = await hc.collations.receipt.image[":uniqueId"].$get({
          param: {
            uniqueId: props.imgObjectKey!,
          },
        });
        return await response?.text();
      } catch (e) {
        return null;
      }
    },
    enabled: !!props.imgObjectKey,
  }));

  return (
    <Modal id="view-image-modal">
      <Show when={receiptImageUrlQuery.isFetching}>
        <IconLoading />
      </Show>
      <Show
        when={receiptImageUrlQuery?.data && !receiptImageUrlQuery.isFetching}
      >
        <img
          src={receiptImageUrlQuery?.data!}
          alt="receipt preview"
          class="h-full w-full"
        />
      </Show>
    </Modal>
  );
}

export const { open: openViewImageModal, close: closeViewImageModal } =
  createModalOpeners("view-image-modal");
