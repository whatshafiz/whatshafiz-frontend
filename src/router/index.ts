import { createRouter, createWebHistory } from "vue-router";
import MainLayout from "@/layouts/MainLayout/MainLayout.vue";
import Page1 from "@/pages/Page1.vue";
import Page2 from "@/pages/Page2.vue";
import Dashboard from "@/pages/Dashboard.vue";
import Login from "@/pages/Login.vue";
import Register from "@/pages/Register.vue";
import VerifyPhoneNumber from "@/pages/VerifyPhoneNumber.vue";

const routes = [
  {
    path: "/",
    component: MainLayout,
    children: [
      {
        path: "/",
        name: "dashboard",
        component: Dashboard,
      },
      {
        path: "page-2",
        name: "side-menu-page-2",
        component: Page2,
      },
    ],
  },
  {
    path: "/login",
    name: "login",
    component: Login,
  },
  {
    path: "/register",
    name: "register",
    component: Login,
  },
  {
    path: "/verify-phone-number",
    name: "verify-phone-number",
    component: VerifyPhoneNumber,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    return savedPosition || { left: 0, top: 0 };
  },
});

export default router;
