<template>
  <div :class="{ full: full }"></div>

  <transition name="fade">
    <div
      class="content-loading width"
      v-if="show"
      :style="{ background: background, position: position }"
    >
      <div class="width f-column center-vertical center-full">
        <lottie-player
          src="/loading.json"
          background="transparent"
          speed="1"
          style="width: 300px; height: 300px"
          loop
          autoplay
        ></lottie-player>

        <p class="mt-4 text-center" v-if="message">
          {{ message }}
        </p>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { reactive } from "vue";
defineProps({
  text: String,
  message: {
    type: String,
    default: null,
  },
  show: {
    type: Boolean,
    default: true,
  },
  background: {
    type: String,
    default: "var(--bg)",
  },
  full: {
    type: Boolean,
    default: false,
  },
  position: {
    type: String,
    default: "absolute",
  },
});
const state = reactive({ count: 0 });
</script>

<style scoped>
.content-loading {
  position: fixed;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 32px;
  min-height: 32px;
  z-index: 5;
}
.loader {
  border: 4px solid var(--c-primary);
  border-radius: 50%;
  border-top: 4px solid var(--c-secondary);
  width: 35px;
  height: 35px;
  -webkit-animation: spin 2s linear infinite; /* Safari */
  animation: spin 2s linear infinite;
}
/* Safari */
@-webkit-keyframes spin {
  0% {
    -webkit-transform: rotate(0deg);
  }
  100% {
    -webkit-transform: rotate(360deg);
  }
}
@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
.message {
  min-width: 80%;
  max-width: 80%;
}
</style>
