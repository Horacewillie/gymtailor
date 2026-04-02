import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { App } from "./app/App";
import "./styles/globals.css";

import { OnboardingProvider } from "./app/OnboardingContext";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <OnboardingProvider>
        <App />
      </OnboardingProvider>
    </BrowserRouter>
  </React.StrictMode>
);
