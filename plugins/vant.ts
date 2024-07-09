import { Lazyload } from "vant";

import type { LazyloadOptions } from "vant/lib/lazyload/vue-lazyload/index";

import * as loadingImageLight from "~/assets/images/light-loading.png";

import * as loadingImageDark from "~/assets/images/dark-loading.png";

import * as defaultUserImage from "~/assets/images/avatar.svg";

import { useDark } from "@vueuse/core";

import timeago from "vue-timeago3";

export default defineNuxtPlugin((nuxtApp) => {
  const isDark = useDark();

  let options: LazyloadOptions = {
    observer: true,
    preLoad: 1.3,
    loading: isDark.value ? loadingImageDark.default : loadingImageLight.default,
    error: defaultUserImage.default,
    observerOptions: {
      rootMargin: "0px",
      // threshold: 0.8,
    },
  };

  nuxtApp.vueApp.use(Lazyload, options).use(timeago);
});
