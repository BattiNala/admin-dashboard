// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite"; // ← correct import

export default defineConfig({
  plugins: [
    tailwindcss(), // This enables Tailwind processing
    react(),
  ],
});
