import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig(({ command }) => {
  const isProduction = command === "build";
  return {
    plugins: [vue()],
    base: isProduction ? "/ludoteca/" : "/",
    server: {
      port: 5173,
      strictPort: true,
      host: true,
    },
  };
});
