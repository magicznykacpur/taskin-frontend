import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  server: {
    proxy: {
      "/api": "http://localhost:42069"
    }
  },
  plugins: [react(), tailwindcss()],
});
