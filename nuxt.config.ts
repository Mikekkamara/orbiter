// https://nuxt.com/docs/api/configuration/nuxt-config

import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { NaiveUiResolver } from "unplugin-vue-components/resolvers";

export default defineNuxtConfig({
  devtools: { enabled: true },
  compatibilityDate: "2024-07-02",
  // ssr: false,
  modules: ["@nuxtjs/tailwindcss", "vue3-pixi-nuxt", "nuxtjs-naive-ui"],
  vite: {
    plugins: [
      Components({
        resolvers: [NaiveUiResolver()],
      }),
    ],
  },
});
