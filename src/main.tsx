import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router";
import { Router } from "./navigation/Router";
import "./shared/globals.css";
import { store } from "./shared/store/store";
import { Toaster } from "react-hot-toast";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <Router />
        <Toaster />
      </BrowserRouter>
    </Provider>
  </StrictMode>
);
