import { FlowProps, JSXElement, onMount, Suspense } from "solid-js";
import Nav from "@/components/Nav";
import { CountContextProvider } from "@/contexts/CountContext";

import "@/styles/app.css";
import "@/styles/nprogress.css";
import { initializeUser } from "@/contexts/authStore";

export default function App(props: FlowProps) {
  onMount(() => {
    initializeUser();
  });

  return (
    <CountContextProvider>
      <Nav />
      {props.children}
    </CountContextProvider>
  );
}
