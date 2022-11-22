<template>
  <div :class="{ full: full }"></div>

  <transition name="fade">
    <div
      class="content-loading width"
      v-if="show"
      :style="{ background: background, position: position }"
    >
      <div class="width f-column center-vertical center-full">
        <div class="loader"></div>
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
  zIndex: {
    type: Number,
    default: 1
  },
});
const state = reactive({ count: 0 });
</script>

<style scoped>
.content-loading {
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 32px;
  min-height: 32px;
  z-index: v-bind(zIndex);
}
.loader {
  border: 4px solid var(--color-ns-secondary) ;
  border-radius: 50%;
  border-top: 4px solid var(--color-ns-cyan);
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
