import { useData } from "vike-solid/useData";
import { Data } from "./+data";
import { createResource } from "solid-js";
import { hc } from "@/lib/honoClient";

export default function DashboardPage() {
  const { user } = useData<Data>();

  const [data, { mutate, refetch }] = createResource(async () => {
    const response = await hc.auth.$get();
    const result = await response.json();

    return result;
  });

  return (
    <div>
      {JSON.stringify(data())}1231
      <h1 class="text-3xl">Dashboard</h1>
      {JSON.stringify(user)}
    </div>
  );
}
