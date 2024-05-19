import { FlowProps, VoidProps } from "solid-js";
import Protected from "./Protected";

export default function RedirectWhenAuthenticated(props: FlowProps) {
  return <Protected authedRedirect="/dashboard">{props.children}</Protected>;
}
