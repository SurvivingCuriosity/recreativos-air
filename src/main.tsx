import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router";
import { Router } from "./navigation/Router";
import "./shared/globals.css";
import { store } from "./shared/store/store";
import { Toaster } from "react-hot-toast";
import { ThemeContextProvider } from "./shared/context/ThemeProvider";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <ThemeContextProvider>
        <BrowserRouter>
          <Router />
          <Toaster />
        </BrowserRouter>
      </ThemeContextProvider>
    </Provider>
  </StrictMode>
);
