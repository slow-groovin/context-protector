import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import tailwind from "@tailwindcss/vite";
import sqlocal from "sqlocal/vite";
import { VitePWA } from "vite-plugin-pwa";

// https://vite.dev/config/
export default defineConfig(({}) => ({
  server: {
    headers: {
      // "Cross-Origin-Embedder-Policy": "require-corp",
      "Cross-Origin-Opener-Policy": "same-origin",
      "Cross-Origin-Embedder-Policy": "credentialless", // 更宽松
    },
  },
  plugins: [
    vue(),
    tailwind(),
    sqlocal(),
    VitePWA({
      registerType: "autoUpdate",
      manifest: {
        name: "Context Protector",
        short_name: "Context Protector",
        description: "A tool to protect and replace context in text",
        theme_color: "#ffffff",
        // id: "/",  // 固定应用 ID
        start_url: "/",
        display: "standalone",
        icons: [
          {
            src: "/icon-192.png", // 至少 192x192
            sizes: "192x192",
            type: "image/png",
            purpose: "any maskable", // 关键！
          },
          {
            src: "/icon-512.png", // 推荐 512x512
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable",
          },
        ],
      },
    }),
  ],
}));
