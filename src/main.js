import { createApp } from 'vue'
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router";
import * as Sentry from "@sentry/vue";
import "./assets/css/app.css";

const app = createApp(App);

Sentry.init({
  app,
  dsn: import.meta.env.VITE_VUE_APP_SENTRY_CRM_FRONTEND_DSN,
  integrations: [
    new Sentry.BrowserTracing({
      routingInstrumentation: Sentry.vueRouterInstrumentation(router),
      tracePropagationTargets: ["panel.whatshafiz.com", /^\//],
    }),
  ],
  tracesSampleRate: 1.0,
});

app.use(router).use(createPinia()).mount('#app')
