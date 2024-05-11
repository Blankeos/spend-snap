import { cn } from "@/lib/cn";
import { FlowProps, Show } from "solid-js";
import IconLoading from "~icons/line-md/loading-twotone-loop";
type ButtonProps = {
  isLoading?: boolean;
};

export default function Button(props: FlowProps<ButtonProps>) {
  return (
    <button class={cn("btn btn-primary")}>
      <span class="flex gap-x-2 items-center">
        <Show when={props.isLoading}>
          <IconLoading />
        </Show>
        <span>{props.children}</span>
      </span>
    </button>
  );
}
