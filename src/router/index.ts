import { createRouter, createWebHistory } from "vue-router";
import MainLayout from "@/layouts/MainLayout/MainLayout.vue";
import { useUserStore } from "@/stores/user";

const routes = [
  {
    path: "/",
    component: MainLayout,
    children: [
      {
        path: "/",
        name: "dashboard",
        component: async () => import("@/pages/Dashboard.vue"),
      },
      {
        path: "/regulations",
        component: async () => import("@/layouts/Regulations.vue"),
        children: [
          {
            path: '',
            name: "regulations.list",
            component: async () => import("@/pages/regulations/List.vue"),
          },
          {
            path: ":slug",
            name: "regulations.view",
            component: async () =>
              import("@/pages/regulations/View.vue"),
          },
          {
            path: ":slug/update",
            name: "regulations.update",
            component: async () => import("@/pages/regulations/Update.vue"),
            meta: {
              permission: {
                resource: 'regulation',
                action: 'update'
              }
            }
          },
        ],
      },
    ],
  },
  {
    path: "/login",
    name: "login",
    component: async () => import("@/pages/Login.vue"),
  },
  {
    path: "/register",
    name: "register",
    component: async () => import("@/pages/Login.vue"),
  },
  {
    path: "/verify-phone-number",
    name: "verify-phone-number",
    component: async () => import("@/pages/VerifyPhoneNumber.vue"),
  },
  {
    path: "/logout",
    name: "logout",
    component: async () => import("@/pages/Logout.vue"),
  },
  {
    path: "/:pathMatch(.*)*",
    name: "404",
    component: async () => import("@/pages/404.vue"),
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
