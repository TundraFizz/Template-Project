import { createApp } from "vue";
import "./register-service-worker";
import App from "./app.vue";
import router from "./router";

createApp(App).use(router).mount("#app");
