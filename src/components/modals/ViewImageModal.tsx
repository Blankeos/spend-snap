import { createEffect, createSignal, Show, VoidProps } from "solid-js";
import Modal, { createModalOpeners } from "./Modal";
import { createQuery } from "@tanstack/solid-query";
import { hc } from "@/lib/honoClient";
import { IconLoading } from "../icons";

type ViewImageModalProps = {
  imgObjectKey?: string;
};

export default function ViewImageModal(props: VoidProps<ViewImageModalProps>) {
  const [imageHasLoaded, setImageHasLoaded] = createSignal(false);

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
    staleTime: Infinity, // Always cache the result of the query
    enabled: !!props.imgObjectKey,
  }));

  createEffect(() => {
    // Whenever imgObjectKey changes, setImageHasLoaded to false.
    if (
      props.imgObjectKey &&
      !receiptImageUrlQuery.data &&
      receiptImageUrlQuery.isFetching
    ) {
      setImageHasLoaded(false);
    }
  });

  return (
    <Modal id="view-image-modal">
      <Show
        when={
          receiptImageUrlQuery.isLoading ||
          receiptImageUrlQuery.isFetching ||
          !imageHasLoaded()
        }
      >
        <div class="flex gap-x-2 items-center">
          <IconLoading />
          <span>Loading Image...</span>
        </div>
      </Show>
      <Show
        when={receiptImageUrlQuery?.data && !receiptImageUrlQuery.isFetching}
      >
        <img
          src={receiptImageUrlQuery?.data!}
          alt="receipt preview"
          class="h-full w-full"
          onload={() => setImageHasLoaded(true)}
        />
      </Show>
    </Modal>
  );
}

export const { open: openViewImageModal, close: closeViewImageModal } =
  createModalOpeners("view-image-modal");
