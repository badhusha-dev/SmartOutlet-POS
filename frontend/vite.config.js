import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: "0.0.0.0",
    hmr: {
      port: 3000,
    },
    allowedHosts: [
      "993f7743-03c9-4866-a416-76f8bb7b4ef5-00-3qzer0uo7r8j7.pike.replit.dev",
    ],
  },
  build: {
    outDir: "dist",
    assetsDir: "assets",
  },
});
