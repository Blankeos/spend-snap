import Button from "@/components/Button";
import RedirectWhenAuthenticated from "@/components/hoc/RedirectWhenAuthenticated";
import { setUser } from "@/contexts/authStore";
import { hc } from "@/lib/honoClient";
import { createForm } from "@felte/solid";
import { validator } from "@felte/validator-superstruct";
import { toast } from "solid-sonner";
import { object, string, size } from "superstruct";
import { navigate } from "vike/client/router";

const struct = object({
  username: string(),
  password: string(),
});

export default function Login() {
  const { form, isSubmitting } = createForm({
    extend: validator({ struct, level: "error" }),
    onSubmit: async (values: typeof struct.TYPE, context) => {
      try {
        const response = await hc.auth.login.$post({
          json: {
            username: values.username,
            password: values.password,
          },
        });

        if (!response.ok) throw new Error("Login failed");

        const result = await response.json();

        setUser(result.user);
        toast.success(`${result.user.username} has logged in!`);
        navigate("/dashboard");
      } catch (e) {
        console.log("found an error here...");
        toast.error(`Failed to login!`);
      }
    },
  });

  return (
    <RedirectWhenAuthenticated>
      <main class="text-center mx-auto text-gray-700 p-4 h-[90vh] flex flex-col justify-center items-center">
        <div class="border rounded-xl border-gray-200 p-12">
          <h1 class="text-2xl font-semibold mb-2">Login</h1>
          <p class="text-primary/50 mb-5 text-sm">
            💰 Login to use Spend Snap!
          </p>

          <form class="form-control gap-y-3" use:form={form}>
            <input
              type="text"
              name="username"
              class="input input-bordered"
              placeholder="Username"
            />
            <input
              type="password"
              name="password"
              class="input input-bordered"
              placeholder="Password"
            />
            <Button
              type="submit"
              class="btn btn-primary"
              isLoading={isSubmitting()}
            >
              Sign In
            </Button>
          </form>

          <div class="h-5" />
          <p class="text-gray-400 text-sm">
            Don't have an account?{" "}
            <a class="text-primary" href="/register">
              Register here
            </a>
          </p>
        </div>
      </main>
    </RedirectWhenAuthenticated>
  );
}
