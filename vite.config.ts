import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 4200,
    open: true,
    allowedHosts: ["devserver-main--justvish.netlify.app"],
  },
  build: {
    outDir: "dist",
    emptyOutDir: true,
  },
});
