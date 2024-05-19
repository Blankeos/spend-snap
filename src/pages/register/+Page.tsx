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
      const response = await hc.auth.register.$post({
        json: {
          username: values.username,
          password: values.password,
        },
      });

      if (!response.ok) return;

      const result = await response.json();

      setUser(result.user);
      toast.success(`${result.user.username} has registered in!`);
      navigate("/dashboard");
    },
  });

  return (
    <RedirectWhenAuthenticated>
      <main class="text-center mx-auto text-gray-700 p-4">
        <h1 class="mb-5 text-2xl font-medium">Register</h1>

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
      </main>
    </RedirectWhenAuthenticated>
  );
}
