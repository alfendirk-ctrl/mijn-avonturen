import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// GitHub Pages van dit repo staat op "Deploy from a branch" en serveert de
// hoofdmap van main. Daarom bouwen we met VASTE bestandsnamen rechtstreeks naar
// de repo-root: een handgeschreven index.html (hieronder in de repo) verwijst
// naar /mijn-avonturen/assets/main.js en main.css, en die bestanden worden hier
// gegenereerd. Zo serveert Pages altijd de gebouwde app.
export default defineConfig({
  base: "/mijn-avonturen/",
  plugins: [react()],
  build: {
    outDir: ".",
    emptyOutDir: false,
    rollupOptions: {
      input: "src/main.jsx",
      output: {
        entryFileNames: "assets/main.js",
        chunkFileNames: "assets/[name].js",
        assetFileNames: "assets/main[extname]",
      },
    },
  },
});
