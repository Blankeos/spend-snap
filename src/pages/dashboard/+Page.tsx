import { useStore } from "@nanostores/solid";
import { $user, initializeUser } from "@/contexts/authStore";
import { createEffect, onMount, Show } from "solid-js";
import { navigate } from "vike/client/router";
import { useProtectedRoute } from "@/hooks/useProtectedRoute";

export default function DashboardPage() {
  useProtectedRoute({ redirectTo: "/" });

  const authStore = useStore($user);

  return (
    <Show when={authStore().user} fallback="Not authenticated.">
      <div>
        <h1 class="text-3xl">Dashboard {authStore().loading}</h1>
        User: {JSON.stringify(authStore().user)}
      </div>
    </Show>
  );
}
