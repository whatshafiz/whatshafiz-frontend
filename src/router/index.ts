import { createRouter, createWebHistory } from "vue-router";
import { useUserStore } from '@/stores/user'
import { useAlertStore } from "@/stores/alert";
import { useSettingStore } from "@/stores/setting";

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
      {
        path: "roles",
        name: "roles",
        children: [
          {
            path: "",
            name: "roles.index",
            component: async () => import("@/pages/roles/Index.vue"),
          },
          {
            path: "new",
            name: "roles.create",
            component: async () => import("@/pages/roles/Create.vue"),
          },
          {
            path: ":roleId",
            name: "roles.edit",
            component: async () => import("@/pages/roles/Edit.vue"),
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

  if (user.profile.phone_number_verified_at === null) {
    const settingStore = useSettingStore()
    await settingStore.fetchSettings()

    if (settingStore.isSettingOpen('whatsapp-verification-is-active-on-user-registration')) {
      return router.push({ name: 'verify-phone-number' })
    }
  }

  if (to.name !== 'profile.edit' && !user.profile.gender) {
    const alert = useAlertStore()
    alert.flushMessages()
    alert.addWarningMessage('Lütfen profil bilgilerinizi doldurun!')

    return router.push({ name: 'profile.edit' })
  }

  return true
})

export default router;
