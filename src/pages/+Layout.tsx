import { FlowProps, JSXElement, Suspense } from "solid-js";
import Nav from "@/components/Nav";
import { CountContextProvider } from "@/contexts/CountContext";

import "@/styles/app.css";
import "@/styles/nprogress.css";

export default function App(props: FlowProps) {
  return (
    <CountContextProvider>
      <Nav />
      {props.children}
    </CountContextProvider>
  );
}
