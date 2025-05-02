import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Toaster } from "sonner";
import AppRouter from "./app-router.tsx";
import "./index.css";
import { CookiesProvider } from "react-cookie";

const root = document.getElementById("root")!;

createRoot(root).render(
  <StrictMode>
    <CookiesProvider defaultSetOptions={{ path: "/" }}>
      <AppRouter />
    </CookiesProvider>
    <Toaster />
  </StrictMode>
);
