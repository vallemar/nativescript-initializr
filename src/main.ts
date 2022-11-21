import { createApp } from "vue";
import { createPinia } from "pinia";
import FloatingVue from "floating-vue";
import "@/utils/Analytics";
import "./style.scss";
import "floating-vue/dist/style.css";
import App from "./App.vue";
import { router } from "@/plugins/router";

const pinia = createPinia();

const app = createApp(App);
app.use(router);
app.use(pinia);
app.use(FloatingVue);
app.mount("#app");
