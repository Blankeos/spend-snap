import { $user } from "@/contexts/authStore";
import { hc } from "@/lib/honoClient";
import { useStore } from "@nanostores/solid";
import { Show } from "solid-js";
import { toast } from "solid-sonner";
import { usePageContext } from "vike-solid/usePageContext";
import { navigate } from "vike/client/router";
import { IconLoading } from "./icons";

export default function Nav() {
  const pageContext = usePageContext();

  const authStore = useStore($user);

  async function logout() {
    const response = await hc.auth.logout.$get();
    const result = await response.json();

    if (result.success) {
      const user = authStore().user; // cache before logging out so we can display toast.
      toast.success(`${user?.username} has logged out!`);
      $user.set({ user: null, loading: false });
      navigate("/");
    } else {
      toast.error(`Failed to log out!`);
      navigate("/login");
    }
  }

  const active = (path: string) =>
    path == pageContext.urlPathname
      ? "border-purple-400"
      : "border-transparent hover:border-purple-400";

  return (
    <nav class="bg-primary flex flex-col gap-y-2 items-center p-3">
      <div class="relative text-white font-bold items-start">
        <span>Spend Snap</span>
        <span class="absolute -top-1 left-[102%] bg-purple-500 text-white rounded-sm text-xs py-[1px] px-1 border-purple-200 border">
          Beta
        </span>
      </div>
      <ul class="container flex items-center text-gray-200 justify-center">
        <li class={`border-b-2 ${active("/")} mx-1.5 sm:mx-6`}>
          <a href="/">Home {authStore().loading}</a>
        </li>
        {/* <li class={`border-b-2 ${active("/about")} mx-1.5 sm:mx-6`}>
          <a href="/about">About</a>
        </li> */}
        <Show when={authStore().loading}>
          <li class="px-2">
            <IconLoading />
          </li>
        </Show>
        <Show when={!authStore().user && !authStore().loading}>
          <li class={`border-b-2 ${active("/login")} mx-1.5 sm:mx-6`}>
            <a href="/login">Login</a>
          </li>
          <li class={`border-b-2 ${active("/register")} mx-1.5 sm:mx-6`}>
            <a href="/register">Register</a>
          </li>
        </Show>
        <Show when={authStore().user && !authStore().loading}>
          <li class={`border-b-2 ${active("/dashboard")} mx-1.5 sm:mx-6`}>
            <a href="/dashboard">Dashboard</a>
          </li>
          <button
            class={`border-b-2 mx-1.5 sm:mx-6 border-transparent hover:border-sky-600`}
            onClick={logout}
          >
            Logout
          </button>
        </Show>
      </ul>
    </nav>
  );
}
