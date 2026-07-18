import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// De app draait op GitHub Pages onder /mijn-avonturen/, dus dat is overal de base-path.
// Lokaal openen op: http://localhost:5173/mijn-avonturen/ (dev) of :4173/mijn-avonturen/ (preview).
export default defineConfig({
  base: "/mijn-avonturen/",
  plugins: [react()],
  build: {
    outDir: "dist",
  },
});
