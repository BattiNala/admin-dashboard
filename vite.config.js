import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

/** Same proxy for `npm run dev` and `npm run preview` so `/api/*` always reaches FastAPI. */
const apiProxy = {
  "/api": {
    target: "http://localhost:8000/api/v1",
    changeOrigin: true,
    secure: false,
    rewrite: (reqPath) => reqPath.replace(/^\/api/, ""),
  },
};

export default defineConfig({
  plugins: [react(), tailwindcss()],

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@components": path.resolve(__dirname, "./src/components"),
      "@pages": path.resolve(__dirname, "./src/pages"),
      "@hooks": path.resolve(__dirname, "./src/hooks"),
      "@utils": path.resolve(__dirname, "./src/utils"),
      "@services": path.resolve(__dirname, "./src/services"),
      "@assets": path.resolve(__dirname, "./src/assets"),
      "@styles": path.resolve(__dirname, "./src/styles"),
      "@context": path.resolve(__dirname, "./src/context"),
      "@layouts": path.resolve(__dirname, "./src/layouts"),
    },
  },

  server: {
    proxy: { ...apiProxy },
  },

  preview: {
    proxy: { ...apiProxy },
  },
});