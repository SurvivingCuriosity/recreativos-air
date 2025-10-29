import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Toaster } from "react-hot-toast";
import { BrowserRouter } from "react-router";
import { Router } from "./navigation/Router";
import api from "./shared/api/http";
import { ThemeContextProvider } from "./shared/context/ThemeProvider";
import { WindowProvider } from "./shared/context/WindowProvider";
import "./shared/globals.css";
import { UIProvider } from "./shared/context/UIProvider/components/UIProviders";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 3 * 60_000, // 3 min
      retry: 2, // idempotentes
      queryFn: ({ queryKey }) => createReactQueryAdapter(queryKey),
    },
  },
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <UIProvider>
        <ThemeContextProvider>
          <BrowserRouter>
            <WindowProvider>
              <Router />
              <Toaster
                toastOptions={{
                  duration: 2000,
                }}
              />
            </WindowProvider>
          </BrowserRouter>
        </ThemeContextProvider>
      </UIProvider>
      {import.meta.env.DEV && (
        <ReactQueryDevtools buttonPosition={"bottom-left"} />
      )}
    </QueryClientProvider>
  </StrictMode>
);

export const createReactQueryAdapter = async ([
  { method = "get", url, data },
]: readonly any[]) => (await api.request({ method, url, data })).data;
