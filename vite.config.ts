import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0", // 모든 IP에서 접근 가능
    port: 5173,
    strictPort: true,
    allowedHosts: [
      "localhost",
      "ping-pong.world",
      ".ping-pong.world", // 서브도메인도 허용
    ],
    proxy: {
      "/api": {
        target: "http://121.167.129.36:3000",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
