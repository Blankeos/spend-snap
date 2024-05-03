import { hc } from "@/lib/honoClient";
import { PageContext } from "vike/types";

export { data };

export type Data = Awaited<ReturnType<typeof data>>;

async function data(pageContext: PageContext, more: any) {
  const { request, response } = pageContext;

  // Proxy the request.headers
  const authGetResponse = await hc.auth.$get({}, { headers: request.header() });
  const result = await authGetResponse.json();

  // Proxy back the response.headers
  for (const [key, value] of authGetResponse.headers) {
    response.headers.set(key, value);
  }

  return result;
}
