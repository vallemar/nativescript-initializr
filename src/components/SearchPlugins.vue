<script setup lang="ts">
import { computed, PropType, ref, watch, reactive } from "vue";
import { Plugin } from "@/types/app.types";
import ItemPlugin from "@/components/ItemPlugin.vue";
import Switch from "@/components/Switch.vue";
import { pluginService } from "@/services/PluginService";
import { computedAsync } from "@vueuse/core";
import { useCommonStore } from "@/plugins/stores/Common.store";

const emit = defineEmits(["togglePlugin", "addPlugin", "removePlugin"]);
const { pluginsStore, addPlugins } = defineProps({
  pluginsStore: {
    type: Array as PropType<Plugin[]>,
    default: () => [],
    required: true,
  },
  addPlugins: {
    type: Array as PropType<Plugin[]>,
    default: () => [],
    required: true,
  },
});
const commonStore = useCommonStore();
const formSearchPlugin = ref<string>();
const searching = ref(false);
const filters = reactive({
  ns: true,
  rs: true,
});

const pluginsMatch = computedAsync<Plugin[]>(async () => {
  searching.value = true;
  const pluginsRN = [];
  if (
    commonStore.enableReactNativePlugins &&
    formSearchPlugin.value &&
    filters.rs
  ) {
    pluginsRN.push(
      ...(await pluginService.searchPluginReactNative(
        formSearchPlugin.value?.toLowerCase()
      ))
    );
  }
  const pluginsNS = pluginsStore.filter((plugin) =>
    // @ts-ignore
    plugin.name.toLowerCase().includes(formSearchPlugin.value?.toLowerCase())
  );
  const maths = [...pluginsNS, ...pluginsRN].sort(function (
    a: Plugin,
    b: Plugin
  ) {
    // @ts-ignore
    return new Date(b.date) - new Date(a.date);
  });
  searching.value = false;
  return (maths || []).slice(0, 25) as Plugin[];
}, []);

const togglePlugin = (plugin: Plugin) => {
  emit("togglePlugin", plugin);
};

commonStore.$subscribe((mutation, state) => {
  const openNativePlugin = pluginsStore.find(
    (plugin) => plugin.name == "@open-native/core"
  );
  if (state.enableReactNativePlugins) {
    emit("addPlugin", openNativePlugin);
  } else {
    emit("removePlugin", openNativePlugin);
  }
});
</script>

<template>
  <div
    class="top-sticky bg p-4 flex items-center grid md:grid-cols-2 grid-cols-1"
  >
    <div class="w-1/2">
      <h3 class="text-2xl">Add your plugins</h3>
      <input
        class="mt-4 w-full"
        v-model="formSearchPlugin"
        type="text"
        placeholder="Search"
      />
    </div>
    <div class="flex flex-col pt-4">
      <div class="flex items-center md:justify-end md:text-right">
        <Switch v-model="commonStore.enableReactNativePlugins"></Switch>
        <span class="">React Native Plugins</span>
      </div>
      <span
        class="text-xs italic mt-1 md:text-right"
        v-if="commonStore.enableReactNativePlugins"
        >Auto apply @open-native/core</span
      >
    </div>
  </div>
  <div v-if="commonStore.enableReactNativePlugins" class="flex items-center">
    <span class="mdi mdi-eye ml-4 text-lg"></span>
    <div
      class="rounded-full px-3 py-1 ml-2 bg-ns-secondary cursor-pointer filter"
      :class="{ selected: filters.ns }"
    >
      NativeScript
    </div>
    <div
      class="rounded-full px-3 py-1 bg-ns-secondary ml-4 cursor-pointer filter"
      :class="{ selected: filters.rs }"
      @click="filters.rs = !filters.rs"
    >
      ReactNative
    </div>
  </div>
  <div class="w-full p-4">
    <ItemPlugin
      class="my-2 cursor-pointer"
      v-for="(pluginSearch, i) in pluginsMatch"
      @click="togglePlugin(pluginSearch)"
      :key="i"
      :plugin="pluginSearch"
      :selected="!!addPlugins.find((x) => x.name === pluginSearch.name)"
    ></ItemPlugin>
    <div v-if="pluginsMatch.length === 0">
      <div v-if="formSearchPlugin && !searching" class="text-center mt-2">
        <span class="bg-ns-secondary px-3 py-2 rounded-full">
          No plugin found with the search
          <span class="italic">{{ formSearchPlugin }}</span>
        </span>

        <div class="my-3">Suggestions</div>
      </div>
      <ItemPlugin
        class="my-2 cursor-pointer"
        v-for="(betterPlugin, i) in pluginsStore.slice(0, 20)"
        @click="togglePlugin(betterPlugin)"
        :key="i"
        :plugin="betterPlugin"
        :selected="!!addPlugins.find((x) => x.name === betterPlugin.name)"
      ></ItemPlugin>
    </div>
  </div>
</template>

<style scoped>
.filter.selected {
  background: var(--color-ns-cyan);
  color: var(--bg);
}
</style>
