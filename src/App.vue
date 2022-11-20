<script setup lang="ts">
import Header from "@/components/Header.vue";
</script>

<template>
  <div id="content-app">
    <Header></Header>
    <router-view :key="$route.path" />
    <div id="modals" style="z-index: 100"></div>
  </div>
</template>

<style scoped>
#content-app {
  flex: 1 1 auto;
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  max-width: 100%;
  position: relative;
}
</style>
