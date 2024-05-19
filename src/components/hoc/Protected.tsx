import {
  IconEmojiSad,
  IconHappy,
  IconLoading,
  IconSad,
} from "@/components/icons";
import { $user } from "@/contexts/authStore";
import { useStore } from "@nanostores/solid";
import { createPresence } from "@solid-primitives/presence";
import {
  createEffect,
  createMemo,
  createSignal,
  FlowProps,
  Match,
  mergeProps,
  onMount,
  Show,
  Switch,
} from "solid-js";
import { navigate } from "vike/client/router";

type ProtectedProps = {
  /** @defaultValue /login */
  fallback?: string;

  /**
   * When authenticated, redirect to this page instead. By default, not used.
   *
   * If used, the usecase is more for /login and /register redirection.
   *
   * If not used, the usecase is completely for protected routes.
   *
   * @defaultValue undefined
   */
  authedRedirect?: string;
};

export default function Protected(props: FlowProps<ProtectedProps>) {
  const defaultProps = mergeProps({ fallback: "/login" }, props);

  const TRANSITION_DURATION = 1000;
  const authStore = useStore($user);
  const [isShown, setIsShow] = createSignal(true);

  createEffect(() => {
    if (authStore().loading) return; // Still fetching. Don't do anything.

    // Stopped fetching. User Exists.
    if (authStore().user) {
      // When there's a user and there's a "redirect". Go to it.
      // Usecase: Going into /login, but there's actually a user.
      if (props.authedRedirect) {
        navigate(props.authedRedirect);
        return;
      }

      // Remove the protector.
      setIsShow(false);
    }

    if (!authStore().user && !authStore().loading) {
      navigate(defaultProps.fallback);

      // Remove the protector.
      setIsShow(false);
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
            <Show
              when={authStore().user}
              fallback={
                <IconSad
                  font-size="3rem"
                  class="absolute"
                  style={{
                    "transition-duration": "800ms",
                    scale: isShown() ? "95%" : "110%",
                    opacity: isShown() ? "0" : 1,
                  }}
                />
              }
            >
              <IconHappy
                font-size="3rem"
                class="absolute"
                style={{
                  "transition-duration": "800ms",
                  scale: isShown() ? "95%" : "110%",
                  opacity: isShown() ? "0" : 1,
                }}
              />
            </Show>
          </div>

          <Show when={!authStore().user && authStore().loading}>
            <span>Looking for User...</span>
          </Show>

          <Show when={authStore().user && !authStore().loading}>
            <span>Hi {authStore().user?.username}!</span>
          </Show>

          <Show when={!authStore().user && !authStore().loading}>
            <span>Not authenticated</span>
          </Show>
        </div>
      </Show>
      <Show when={!isShown()}>{props.children}</Show>
    </>
  );
}
