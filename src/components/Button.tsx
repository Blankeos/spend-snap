import { cn } from "@/lib/cn";
import { FlowProps, JSX, mergeProps, Show, splitProps } from "solid-js";
import IconLoading from "~icons/line-md/loading-twotone-loop";
type ButtonProps = {
  class?: string;
  isLoading?: boolean;
} & JSX.ButtonHTMLAttributes<HTMLButtonElement>;

export default function Button(props: FlowProps<ButtonProps>) {
  const [_, buttonProps] = splitProps(props, ["class", "isLoading"]);

  const {} = mergeProps(props);

  return (
    <button
      {...buttonProps}
      class={cn("btn btn-primary", props.class)}
      disabled={props.isLoading}
    >
      <span class="flex gap-x-2 items-center">
        <Show when={props.isLoading}>
          <IconLoading />
        </Show>
        <span>{props.children}</span>
      </span>
    </button>
  );
}
