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

export default function Register() {
  const { form, isSubmitting } = createForm({
    extend: validator({ struct, level: "error" }),
    onSubmit: async (values: typeof struct.TYPE, context) => {
      try {
        const response = await hc.auth.register.$post({
          json: {
            username: values.username,
            password: values.password,
          },
        });

        if (!response.ok) {
          const error = (await response.json()) as unknown as {
            error: { message: string };
          };
          throw new Error(error?.error?.message);
        }

        const result = await response.json();

        setUser(result.user);
        toast.success(`${result.user.username} has registered in!`);
        navigate("/dashboard");
      } catch (e: any) {
        toast.error(`Failed to register! ${e.message}`);
      }
    },
  });

  return (
    <RedirectWhenAuthenticated fallback="/register">
      <main class="text-center mx-auto text-gray-700 p-4 h-[90vh] flex flex-col justify-center items-center">
        <div class="border rounded-xl border-gray-200 p-12">
          <h1 class="text-2xl font-semibold mb-2">Register</h1>
          <p class="text-primary/50 mb-5 text-sm">
            💰 Register to use Spend Snap!
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
              Register
            </Button>
          </form>

          <div class="h-5" />
          <p class="text-gray-400 text-sm">
            Already have an account?{" "}
            <a class="text-primary" href="/login">
              Login here
            </a>
          </p>
        </div>
      </main>
    </RedirectWhenAuthenticated>
  );
}
