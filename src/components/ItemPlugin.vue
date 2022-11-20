<script setup lang="ts">
import { PropType } from "vue";
import { Plugin } from "@/types/app.types";

const { plugin } = defineProps({
  plugin: {
    type: Object as PropType<Plugin>,
    required: true,
  },
  selected: Boolean,
});
defineEmits(["selected", "remove"]);

const formatDate = (date: string) => {
  const dateObject = new Date(date);
  return (
    ("0" + dateObject.getDate()).slice(-2) +
    "/" +
    ("0" + (dateObject.getMonth() + 1)).slice(-2) +
    "/" +
    dateObject.getFullYear()
  );
};
</script>

<template>
  <div
    class="flex p-2 rounded-2xl flex-col"
    style="border: 1px solid var(--color-ns-secondary)"
    :class="{ selected }"
  >
    <div>
      <div class="flex justify-between items-center">
        <span class="text-lg font-bold">
          {{ plugin.name }}
        </span>
        <span class="text-base text-right">
          <span class="hidden md:inline-block">Updated:</span>
          {{ formatDate(plugin.date) }}
        </span>
      </div>
      <div class="text-base mt-2">
        {{ plugin.description }}
      </div>
    </div>
    <div class="flex justify-between items-center mt-3">
      <span>Last month download {{ plugin.downloadStats.lastMonth }}</span>
      <div class="flex items-center">
        <a
          v-if="plugin.links.repository"
          :href="plugin.links.repository"
          target="_blank"
          class="mr-3"
          style="height: 22px"
        >
          <span class="mdi mdi-github"></span>
        </a>
        <a
          class="px-3 rounded-full truncate overflow-hidden"
          style="background: #d55553"
          :href="plugin.links.npm"
          target="_blank"
        >
          npm v{{ plugin.version }}
        </a>
      </div>
    </div>
  </div>
</template>

<style scoped>
.icon-group {
  width: 20px;
  height: 20px;
}
.selected {
  background: var(--color-ns-secondary);
}
</style>
