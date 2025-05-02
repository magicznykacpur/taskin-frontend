import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import AppRouter from "./App.tsx";
import "./index.css";

const root = document.getElementById("root")!;

createRoot(root).render(
  <StrictMode>
    <AppRouter />
  </StrictMode>
);
