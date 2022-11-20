<script setup lang="ts">
import { PropType } from "vue";
import { Flavor } from "@/types/app.types";

const props = defineProps({
  data: Array as PropType<Flavor[]>,
});
defineEmits(["selected"]);
</script>

<template>
  <div class="flex flex-wrap">
    <div
      v-for="(item, i) in props.data"
      class="mt-4 px-3 py-1 flex items-center rounded-full cursor-pointer transition-all font-bold mx-2"
      :class="[item.selected ? 'bg-ns-secondary' : '']"
      @click="$emit('selected', i)"
    >
      <img v-if="item.img" :src="item.img" class="icon-group mr-1" />
      <span>{{ item.text }}</span>
    </div>
  </div>
</template>

<style scoped>
.icon-group {
  width: 20px;
  height: 20px;
}
.selected {
  background: white;
}
</style>
