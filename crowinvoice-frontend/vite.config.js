
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],

  server: {
    host: "localhost",

    proxy: {
      "/backend": {
        target: "https://tools.crowdemo.com",
        changeOrigin: true,
        secure: true,

        cookieDomainRewrite: "localhost",

        autoRewrite: true,
        protocolRewrite: "http",

        rewrite: (path) =>
          path.replace(/^\/backend/, ""),
      },
    },
  },
});
