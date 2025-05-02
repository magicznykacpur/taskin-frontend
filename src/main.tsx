import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Toaster } from "sonner";
import AppRouter from "./app-router.tsx";
import "./index.css";

const root = document.getElementById("root")!;

createRoot(root).render(
  <StrictMode>
    <AppRouter />
    <Toaster />
  </StrictMode>
);
