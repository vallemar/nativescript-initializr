import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

const customElements = ["lottie-player"];
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue({
      template: {
        compilerOptions: {
          isCustomElement: (e) => customElements.indexOf(e) !== -1,
        },
      },
    }),
  ],
  resolve: {
    alias: {
      "@/": "/src/",
      "node-fetch": "isomorphic-fetch",
    },
  },
});
