import { hc } from "@/lib/honoClient";
import { ClientRequestOptions, InferResponseType } from "hono";
import { map } from "nanostores";

type UserStore = {
  user: InferResponseType<typeof hc.auth.$get>["user"] | null;
  loading: boolean;
};

export const $user = map<UserStore>({
  user: null,
  loading: true,
});

// Setters

/** Should only be called once in layout. */
export const initializeUser = async (options?: ClientRequestOptions) => {
  $user.setKey("loading", true);

  console.log("User is initializing.");
  const response = await hc.auth.$get(options);
  const result = await response.json();

  console.log(result);
  $user.set({ user: result?.user ?? null, loading: false });
};

/** Call this when logging in. */
export const setUser = async (
  user: InferResponseType<typeof hc.auth.$get>["user"]
) => {
  $user.setKey("user", user);
};
