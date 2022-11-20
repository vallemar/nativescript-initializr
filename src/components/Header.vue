<script setup lang="ts"></script>

<template>
  <div>
    <nav class="header border-slate-50/[0.06] border">
      <div class="flex items-center width-content h-full px-3">
        <img class="logo" src="/img/ns-logo-dark.svg" />
        <h1 class="lg:text-4xl text-3xl ml-4 font-bold">
          NativeScript Initializr ⚡
        </h1>
      </div>
    </nav>
  </div>
</template>

<style scoped>
.logo {
  width: 40px;
  height: 40px;
}
.header {
  height: var(--height-header);
}
</style>
