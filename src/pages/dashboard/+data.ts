import { hc } from "@/lib/honoClient";
import { PageContext } from "vike/types";

export { data };

export type Data = Awaited<ReturnType<typeof data>>;

async function data(pageContext: PageContext, more: any) {
  await new Promise((resolve) =>
    setTimeout(resolve, 100 + Math.random() * 100)
  );

  console.log(pageContext.headers);

  const response = await hc.auth.$get(
    {},
    {
      headers: pageContext.headers,
    }
  );

  const result = await response.json();

  return result;
}
