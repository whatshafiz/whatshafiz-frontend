import { createRouter, createWebHistory } from "vue-router";
import { isLoggedIn, userLogout } from '@/services/AuthService'
import { useUserStore } from '@/stores/user'

const routes = [
  {
    path: "/",
    component: async () => import("@/layouts/MainLayout/MainLayout.vue"),
    children: [
      {
        path: "/",
        name: "dashboard",
        component: async () => import("@/pages/Dashboard.vue"),
      },
      {
        path: "/profile",
        name: "profile",
        component: async () => import("@/pages/users/Profile.vue"),
      },
      {
        path: "/profile/edit",
        name: "profile.edit",
        component: async () => import("@/pages/users/ProfileEdit.vue"),
      },
      {
        path: "page-2",
        name: "courses",
        component: async () => import("@/pages/Page2.vue"),
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
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    return savedPosition || { left: 0, top: 0 };
  },
});

router.beforeEach(async (to, from) => {
  const guestRoutes = ['login', 'logout', 'register']
  
  if (guestRoutes.includes(to.name)) {
    return true
  }

  const user = useUserStore()

  if (!user.isLoggedIn()) {
    return user.logout()
  }

  if (Object.keys(user.profile).length === 0) {
    await user.fetchProfile()
  }

  return true
})

export default router;
