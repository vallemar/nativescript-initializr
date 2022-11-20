import { ref } from "vue";
import { defineStore } from "pinia";

export const useCommonStore = defineStore("common", () => {
  const enableReactNativePlugins = ref(false);

  return { enableReactNativePlugins };
});
