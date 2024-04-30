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
