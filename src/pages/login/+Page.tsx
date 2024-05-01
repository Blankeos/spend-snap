import { hc } from "@/lib/honoClient";
import { createForm } from "@felte/solid";
import { validator } from "@felte/validator-superstruct";
import { object, string, size } from "superstruct";

const struct = object({
  username: string(),
  password: string(),
});

export default function Login() {
  const { form, data } = createForm({
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

        alert(`${result.user.id} has logged in!`);
      } catch (e) {
        console.log("found an error here...");
        alert(e);
      }
    },
  });

  return (
    <main class="text-center mx-auto text-gray-700 p-4">
      <h1 class="">Login</h1>

      {JSON.stringify(data())}

      <form class="form-control" use:form={form}>
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
        <button type="submit" class="btn btn-primary">
          Sign In
        </button>
      </form>
    </main>
  );
}
