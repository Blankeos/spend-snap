import { $user } from "@/contexts/authStore";
import { useStore } from "@nanostores/solid";
import {
  ComponentProps,
  FlowProps,
  JSX,
  mergeProps,
  splitProps,
} from "solid-js";
import { Show } from "solid-js/web";

type ShowWhenAuthenticatedProps = {
  fallback?: JSX.Element;
};

export default function ShowWhenAuthenticated(
  props: FlowProps<ShowWhenAuthenticatedProps>
) {
  const authStore = useStore($user);

  return (
    <Show
      when={!authStore().loading && authStore().user}
      fallback={props.fallback}
    >
      {props.children}
    </Show>
  );
}
