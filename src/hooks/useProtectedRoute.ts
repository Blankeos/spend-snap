import { $user } from "@/contexts/authStore";
import { useStore } from "@nanostores/solid";
import { createEffect, mergeProps } from "solid-js";
import { navigate } from "vike/client/router";

export const useProtectedRoute = (params: {
  /** This route should be unauthenticated. */
  redirectTo: string;
}) => {
  const { redirectTo } = mergeProps({ redirectTo: "/" }, params);

  const authStore = useStore($user);

  createEffect(() => {
    const noUserFound = !authStore().user && !authStore().loading;
    if (noUserFound) navigate(redirectTo);
  });
};
