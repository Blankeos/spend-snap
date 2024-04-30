import { FlowProps, JSXElement, Suspense } from "solid-js";
import Nav from "@/components/Nav";
import "@/styles/app.css";
import { CountContextProvider } from "@/contexts/CountContext";

export default function App(props: FlowProps) {
  return (
    <CountContextProvider>
      <Nav />
      {props.children}
    </CountContextProvider>
  );
}
