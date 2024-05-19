import { ComponentProps, FlowProps, mergeProps, VoidProps } from "solid-js";
import Protected from "./Protected";

export default function RedirectWhenAuthenticated(
  props: FlowProps<ComponentProps<typeof Protected>>
) {
  const defaultProps = mergeProps(
    { fallback: "/login", authedRedirect: "/dashboard" },
    props
  );

  return (
    <Protected
      authedRedirect={defaultProps.authedRedirect}
      fallback={defaultProps.fallback}
    >
      {props.children}
    </Protected>
  );
}
