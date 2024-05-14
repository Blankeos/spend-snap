import { IconHappy, IconLoading } from "@/components/icons";
import { $user } from "@/contexts/authStore";
import { useStore } from "@nanostores/solid";
import { createPresence } from "@solid-primitives/presence";
import {
  createEffect,
  createMemo,
  createSignal,
  FlowProps,
  Match,
  onMount,
  Show,
  Switch,
} from "solid-js";
import { navigate } from "vike/client/router";

export default function Protected(props: FlowProps) {
  const TRANSITION_DURATION = 1000;
  const authStore = useStore($user);
  const [isShown, setIsShow] = createSignal(true);
  createEffect(() => {
    if (authStore().loading) return; // Still fetching. Don't do anything.

    // Stopped fetching. User Exists.
    if (authStore().user) {
      setIsShow(false);
    }

    if (!authStore().user && !authStore().loading) {
      navigate("/login");
    }
  });

  const protectorPresence = createPresence(isShown, {
    transitionDuration: TRANSITION_DURATION,
  });

  return (
    <>
      <Show when={protectorPresence.isMounted()}>
        <div
          class="pointer-events-none fixed h-screen z-50 w-screen bg-primary flex flex-col gap-y-5 items-center justify-center text-white transition"
          style={{
            "transition-duration": `${TRANSITION_DURATION}ms`, // Remove extra ms so
            ...(protectorPresence.isExiting() && {
              opacity: "0",
            }),
            ...(protectorPresence.isVisible() && {
              opacity: "1",
            }),
          }}
        >
          <div class="relative w-12 h-12">
            <IconLoading
              font-size="3rem"
              class="absolute"
              style={{
                "transition-duration": "400ms",
                opacity: isShown() ? 1 : "0",
              }}
            />
            <IconHappy
              font-size="3rem"
              class="absolute"
              style={{
                "transition-duration": "800ms",
                scale: isShown() ? "95%" : "110%",
                opacity: isShown() ? "0" : 1,
              }}
            />
          </div>

          <Show
            fallback={<span>Looking for User...</span>}
            when={authStore().user && !authStore().loading}
          >
            <span>Hi {authStore().user?.username}!</span>
          </Show>
          {/* <Show when={authStore().user && !authStore().loading}>
            <span>Hi {authStore().user?.username}!</span>
          </Show> */}
          <span></span>
        </div>
      </Show>
      <Show when={authStore().user}>{props.children}</Show>
    </>
  );
}
