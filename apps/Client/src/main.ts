import { createApp } from "vue";
import "./index.css";
import App from "./App.vue";
import router from "./router";
import { createPinia } from "pinia";
import { useAuthStore } from "./stores/AuthStore";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";

const app = createApp(App);
const pinia = createPinia();

pinia.use(piniaPluginPersistedstate);

app.use(pinia);
app.use(router);

const authStore = useAuthStore();
authStore.initialize().then(() => {
	app.mount("#app");
});
