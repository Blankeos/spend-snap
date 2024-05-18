import { Toaster } from "solid-sonner";
import { FlowProps, onMount } from "solid-js";
import Nav from "@/components/Nav";
import { CountContextProvider } from "@/contexts/CountContext";
import { SolidQueryDevtools } from "@tanstack/solid-query-devtools";

import "@/styles/app.css";
import "@/styles/nprogress.css";

import { initializeUser } from "@/contexts/authStore";
import { QueryClient } from "@tanstack/query-core";
import { QueryClientProvider } from "@tanstack/solid-query";

export default function App(props: FlowProps) {
  onMount(() => {
    initializeUser();
  });

  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <SolidQueryDevtools initialIsOpen={false} />
      <CountContextProvider>
        <Nav />
        {props.children}
        <Toaster position="top-center" />
      </CountContextProvider>
    </QueryClientProvider>
  );
}
