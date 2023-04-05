import { createApp } from 'vue'
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router";
import * as Sentry from "@sentry/vue";
import "./assets/css/app.css";

const app = createApp(App);

Sentry.init({
  app,
  dsn: "https://edb89bda4e684c049f7f5e183e68fabe@o377863.ingest.sentry.io/4504960478674944",
  integrations: [
    new Sentry.BrowserTracing({
      routingInstrumentation: Sentry.vueRouterInstrumentation(router),
      tracePropagationTargets: ["panel.whatshafiz.com", /^\//],
    }),
  ],
  tracesSampleRate: 1.0,
});

app.use(router).use(createPinia()).mount('#app')
