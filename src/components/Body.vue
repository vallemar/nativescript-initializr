<script setup lang="ts">
import { computed, PropType, reactive, ref } from "vue";
import { Plugin, ProjectMetadata, Flavor } from "@/types/app.types";
import RadioGroup from "@/components/RadioGroup.vue";
import { FLAVORS, PROJECT_DEFINITION } from "@/constant/constant";
import { pluginService } from "@/services/PluginService";
import ItemPlugin from "@/components/ItemPlugin.vue";
import Modal from "@/components/Modal.vue";
import { useWindowSize } from "@vueuse/core";
import { DownloadProjectService } from "@/services/DownloadProjectService";
import Loading from "@/components/Loading.vue";
import SearchPlugins from "@/components/SearchPlugins.vue";

const downloadProjectService: DownloadProjectService =
  new DownloadProjectService();
const { width } = useWindowSize();
const loading = ref(false);
const refDownload = ref<HTMLAnchorElement>();
const formFlavor = ref<Flavor[]>(FLAVORS);
const projectMetadata = reactive<ProjectMetadata>(PROJECT_DEFINITION);
const pluginsStore = ref<Plugin[]>([]);
const addPlugins = ref<Plugin[]>([]);
const openModalAddPlugin = ref(false);

const onSelectedFlavor = (index: number) => {
  console.log(index);
  formFlavor.value.forEach((flavor) => (flavor.selected = false));
  formFlavor.value[index].selected = true;
};

const togglePlugin = (plugin: Plugin) => {
  if (addPlugins.value.find((x) => x.name === plugin.name)) {
    removePlugin(plugin);
  } else {
    addPlugin(plugin);
  }
};

const addPlugin = (plugin: Plugin) => {
  addPlugins.value.push(plugin);
};

const removePlugin = (plugin: Plugin) => {
  const index = addPlugins.value.findIndex((x) => x.name === plugin.name);
  addPlugins.value.splice(index, 1);
};

const download = async () => {
  loading.value = true;
  const flavor = formFlavor.value.find((flavor) => flavor.selected);
  if (flavor) {
    await downloadProjectService.download(
      refDownload.value!,
      flavor,
      projectMetadata,
      addPlugins.value
    );
    loading.value = false;
  }
};

pluginService.findAll().then((plugins) => {
  pluginsStore.value.push(
    ...plugins.sort(function (a: Plugin, b: Plugin) {
      // @ts-ignore
      return new Date(b.date) - new Date(a.date);
    })
  );
});
</script>

<template>
  <Loading
    :full="true"
    message="Generating project"
    :show="loading"
    position="fixed"
  ></Loading>
  <div class="px-3 my-8 mb-16">
    <a ref="refDownload"></a>
    <div class="width-content grid lg:grid-cols-2 grid-cols-1">
      <div class="pr-4">
        <div class="border-b pb-5">
          <h3 class="text-2xl">Select Flavor</h3>
          <RadioGroup
            @selected="onSelectedFlavor"
            :data="formFlavor"
          ></RadioGroup>
        </div>
        <div class="mt-5">
          <h3 class="text-2xl">Project Metadata</h3>
          <div class="flex flex-col lg:w-4/6 w-full">
            <span class="text-xxs mt-4">Project name</span>
            <input v-model="projectMetadata.name" type="text" />
            <span class="text-xxs mt-4">Description</span>
            <input v-model="projectMetadata.description" type="text" />
            <span class="text-xxs mt-4">Package name</span>
            <input v-model="projectMetadata.package" type="text" />
          </div>
        </div>
      </div>
      <div class="lg:p-4 p-0 mt-9 lg:border-left">
        <div class="flex justify-between items-center border-b pb-4">
          <h3 class="text-2xl">Plugins</h3>
          <div
            class="border px-3 py-1 rounded-full cursor-pointer"
            @click="openModalAddPlugin = true"
          >
            Add plugins
          </div>
        </div>
        <div class="mt-2 added-plugin">
          <div
            v-for="(pluginAdded, i) in addPlugins"
            :key="i"
            class="flex items-center"
          >
            <ItemPlugin
              class="my-2"
              style="width: calc(100% - 48px)"
              :plugin="pluginAdded"
            ></ItemPlugin>
            <div style="width: 48px" class="flex justify-center">
              <span
                class="mdi mdi-delete cursor-pointer color-error"
                @click="togglePlugin(pluginAdded)"
              ></span>
            </div>
          </div>
          <span v-if="addPlugins.length === 0" class="text-base italic"
            >No plugins selected</span
          >
        </div>
      </div>
    </div>
    <div
      style="position: fixed; bottom: 0px; left: 0"
      class="flex justify-end md:justify-center items-center w-full bg-ns-secondary footer"
    >
      <div class="absolute" style="left: 22px">
        <a
          href="https://github.com/vallemar/NativeScript-Initializr"
          target="_blank"
          class="flex items-center"
        >
          <span> Community Tool </span>
          <span class="mdi mdi-github ml-2"></span>
        </a>
      </div>
      <button
        class="px-5 py-2 color-bg font-bold mr-4 md:mr-0 rounded-full"
        style="background: var(--color-ns-cyan)"
        @click="download"
      >
        Download
      </button>
    </div>
    <Modal
      :open="openModalAddPlugin"
      :full-screen="width < 1000"
      max-height="50%"
      @close="openModalAddPlugin = false"
    >
      <SearchPlugins
        :pluginsStore="pluginsStore"
        :addPlugins="addPlugins"
        @togglePlugin="togglePlugin"
      >
      </SearchPlugins>
    </Modal>
  </div>
</template>

<style scoped>
.mdi-delete {
  opacity: 0;
  transition: 250ms;
}
.added-plugin:hover .mdi-delete {
  opacity: 1;
}
.footer {
  height: var(--height-header);
}
.border-b {
  border-bottom: 1px solid var(--color-ns-secondary);
}
.border-left {
  border-left: 1px solid var(--color-ns-secondary);
}
</style>
