import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router";
import globalComponents from "./global-components";
import utils from "./utils";
import "./assets/css/app.css";
import axios from "axios"; 
import Notifications from '@kyvg/vue3-notification'
import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";
import { createMetaManager } from 'vue-meta'
import GlobalHelper from "./helpers/global";



axios.defaults.baseURL = import.meta.env.VITE_BACKEND_ROUTES;

axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  );

const app = createApp(App).use(router).use(createPinia());

globalComponents(app);
utils(app);
app.use(Notifications)
app.use(GlobalHelper)

const options = {};


app.use(Toast, options)
app.use(createMetaManager())

app.mount("#app");
