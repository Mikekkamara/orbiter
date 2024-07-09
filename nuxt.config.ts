// https://nuxt.com/docs/api/configuration/nuxt-config

import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { NaiveUiResolver } from "unplugin-vue-components/resolvers";

export default defineNuxtConfig({
  devtools: { enabled: false },
  compatibilityDate: "2024-07-02",
  // ssr: false,
  modules: ["@nuxtjs/tailwindcss", "vue3-pixi-nuxt", "nuxtjs-naive-ui"],
  build: {
    transpile: process.env.NODE_ENV === "production" ? ["naive-ui", "vueuc", "@css-render/vue3-ssr", "@juggle/resize-observer"] : ["@juggle/resize-observer"],
  },
  vite: {
    optimizeDeps: {
      include: process.env.NODE_ENV === "development" ? ["naive-ui", "vueuc", "date-fns-tz/esm/formatInTimeZone"] : [],
      esbuildOptions: {
        define: {
          global: "globalThis",
        },
      },
    },
    plugins: [
      Components({
        resolvers: [NaiveUiResolver()],
      }),
    ],
  },
});
