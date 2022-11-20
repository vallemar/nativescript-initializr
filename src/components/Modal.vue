<template>
  <teleport to="#modals">
    <transition name="fade">
      <div v-if="openModal">
        <div class="modal-overlay" id="modal-overlay"></div>
        <div
          ref="refModal"
          class="modal bg-light"
          :class="[fullScreen ? 'full-screen' : 'rounded-2xl']"
          id="modal"
          :style="{ height: fullScreen ? '100%' : maxHeight }"
        >
          <div class="relative dark:shadow-2xl">
            <div
              :outline="false"
              @click.prevent="closeModal"
              class="close-modal cursor-pointer"
            >
              <span class="mdi mdi-close"></span>
            </div>
            <slot class=""></slot>
          </div>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from "vue";
import { onClickOutside } from "@vueuse/core";
import { onKeyStroke } from "@vueuse/core";
import { useRoute, useRouter } from "vue-router";

const OpenModal = "op";
export default defineComponent({
  name: "Modal",
  components: {},
  props: {
    open: {
      type: Boolean,
      default: false,
    },
    fullScreen: {
      type: Boolean,
      default: false,
    },
    maxHeight: {
      type: String,
      default: "100%",
    },
  },
  emits: ["close"],
  setup(props, context) {
    const openModal = ref(props.open);
    const refModal = ref<HTMLElement>(null!);
    const route = useRoute();
    const router = useRouter();
    onClickOutside(refModal, (event) => closeModal());
    watch(
      () => props.open,
      () => {
        openModal.value = props.open;
        if (openModal.value) {
          router.push({
            path: route.path,
            query: {
              [OpenModal]: "true",
            },
          });
        }
      }
    );

    const closeModal = () => {
      openModal.value = false;
      context.emit("close");
      const query = Object.assign({}, route.query);
      delete query[OpenModal];
      router.replace({ path: route.path, query });
    };
    onKeyStroke("Escape", () => {
      if (openModal.value) {
        closeModal();
      }
    });
    router.beforeEach((guard) => {
      if (openModal.value && guard.query[OpenModal]) {
        openModal.value = guard.query[OpenModal] == "true" || false;
        if (!openModal.value) {
          context.emit("close");
        }
      } else {
        openModal.value = false;
        context.emit("close");
      }
    });
    return {
      openModal,
      closeModal,
      refModal,
    };
  },
});
</script>

<style lang="scss">
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
.close-modal {
  position: absolute;
  right: 15px;
  top: 15px;
  z-index: 1;
}
.modal {
  overflow: auto;
  display: block;
  min-width: 200px;
  width: auto;
  max-width: 100%;
  min-height: 100px;
  height: auto;
  max-height: 100%;
  position: fixed;
  z-index: 100;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
.closed {
  display: none;
}
.modal.full-screen {
  left: 0%;
  top: 0%;
  transform: translate(0, 0);
  height: 100vh;
  width: 100vw;
}
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 50;
  background: rgba(153, 153, 153, 0.6);
}
/*
.dark {
  .modal-overlay {
    background: rgb(0 30 38/68%);;
  }
}*/
</style>
