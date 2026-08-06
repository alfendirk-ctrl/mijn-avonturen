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
        // Ook losse brokken krijgen een vaste naam: er staat geen hash in, dus
        // ze moeten wél zelf een herkenbare naam hebben (anders heet de
        // tekstherkenning "index.js" en botst hij met de volgende brok).
        chunkFileNames: "assets/[name].js",
        assetFileNames: "assets/main[extname]",
        manualChunks(id) {
          if (id.includes("node_modules/tesseract.js")) return "tekstherkenning";
        },
      },
    },
  },
});
