// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // forward /api/... to https://api.frontendexpert.io/api/...
      "^/api/.*": {
        target: "https://api.frontendexpert.io",
        changeOrigin: true,
        secure: true,
        // 🔴 remove rewrite — we want to keep /api in the path
        // rewrite: (path) => path.replace(/^\/api/, ''),  <-- delete this line
      },
    },
  },
});
