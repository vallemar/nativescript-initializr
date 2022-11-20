<script setup lang="ts">
import { computed, PropType, ref } from "vue";
import { Plugin } from "@/types/app.types";
import ItemPlugin from "@/components/ItemPlugin.vue";

const emit = defineEmits(["togglePlugin"]);
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

const formSearchPlugin = ref<string>();

const pluginsMatch = computed<Plugin[]>(() => {
  return (
    pluginsStore.filter((plugin) =>
      // @ts-ignore
      plugin.name.toLowerCase().includes(formSearchPlugin.value?.toLowerCase())
    ) || []
  ).slice(0, 20) as Plugin[];
});

const togglePlugin = (plugin: Plugin) => {
  emit("togglePlugin", plugin);
};
</script>

<template>
  <div class="top-sticky bg p-4">
    <h3 class="text-2xl">Add your plugins</h3>
    <input
      class="mt-4 w-1/2"
      v-model="formSearchPlugin"
      type="text"
      placeholder="Search"
    />
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
      <div v-if="formSearchPlugin" class="text-center mt-2">
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

<style scoped></style>
