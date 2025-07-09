import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: true,
    open: true,
    cors: true,
  },
  build: {
    outDir: "dist",
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom"],
          web3: ["web3", "ethers"],
          ui: ["framer-motion", "react-router-dom"],
          utils: ["date-fns", "crypto-js"],
        },
      },
    },
  },
  define: {
    global: "globalThis",
    "process.env": process.env,
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
      components: resolve(__dirname, "src/components"),
      pages: resolve(__dirname, "src/pages"),
      hooks: resolve(__dirname, "src/hooks"),
      utils: resolve(__dirname, "src/utils"),
      styles: resolve(__dirname, "src/styles"),
      context: resolve(__dirname, "src/context"),
    },
  },
  optimizeDeps: {
    include: ["react", "react-dom", "web3", "ethers"],
    exclude: ["@vite/client", "@vite/env"],
  },
});
