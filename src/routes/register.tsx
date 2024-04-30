import { registerService } from "@/server/services/register";
import { createForm } from "@felte/solid";
import { action, json } from "@solidjs/router";
import { getRequestEvent } from "solid-js/web";

const register = action(async (formData: FormData) => {
  const event = getRequestEvent();
  const cookie = event?.request.headers.get("cookie");

  // Imagine this is a call to fetch
  const username = formData.get("username") as string | null;
  const password = formData.get("password") as string | null;

  if (!username || !password) return { success: false };

  const { createdUser, session, sessionCookie } = await registerService({
    username,
    password,
  });
});

export default function Register() {
  return (
    <main class="text-center mx-auto text-gray-700 p-4">
      <h1 class="">Register</h1>

      <form class="form-control">
        <input
          type="text"
          name="email"
          class="input input-bordered"
          placeholder="Username"
        />
        <input
          type="password"
          name="password"
          class="input input-bordered"
          placeholder="Password"
        />
        <button type="submit" class="btn btn-primary">
          Sign In
        </button>
      </form>
    </main>
  );
}
