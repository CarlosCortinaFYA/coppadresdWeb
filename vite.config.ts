import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  // En desarrollo, /api se enruta al API Gateway local (mismo patrón que la app
  // del paciente) para evitar CORS. En producción se usa VITE_GATEWAY_BASE_URL.
  // DEV_PROXY_TARGET (solo desarrollo, no se incrusta en el bundle) permite
  // apuntar el proxy a otro destino, p. ej. una instancia de Auth de pruebas.
  const gatewayTarget = (
    env.DEV_PROXY_TARGET || env.VITE_GATEWAY_BASE_URL || "http://localhost:5080"
  ).replace(/\/+$/, "");

  return {
    plugins: [react()],
    server: {
      allowedHosts: [".ngrok-free.dev", ".ngrok-free.app"],
      fs: {
        deny: [".env", ".env.*", "**/.git/**", "**/docs/**", "**/.analysis/**"],
      },
      proxy: {
        "/api": { target: gatewayTarget, changeOrigin: true },
      },
    },
  };
});
