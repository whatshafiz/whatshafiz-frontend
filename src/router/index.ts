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
        path: "page-2",
        name: "courses",
        component: async () => import("@/pages/Page2.vue"),
      },
      {
        path: "whatsappGroups",
        name: "whatsappGroups",
        children: [
          {
            path: "",
            name: "whatsappGroups.index",
            component: async () => import("@/pages/whatsappGroups/Index.vue"),
          },
          {
            path: "new",
            name: "whatsappGroups.create",
            component: async () => import("@/pages/whatsappGroups/Create.vue"),
          },
          {
            path: ":whatsappGroupId",
            name: "whatsappGroups.view",
            component: async () => import("@/pages/whatsappGroups/View.vue"),
          },
          {
            path: ":whatsappGroupId/edit",
            name: "whatsappGroups.edit",
            component: async () => import("@/pages/whatsappGroups/Edit.vue"),
          },
        ],
      },
      {
        path: "quranQuestions",
        name: "quranQuestions",
        children: [
          {
            path: "",
            name: "quranQuestions.index",
            component: async () => import("@/pages/quranQuestions/Index.vue"),
          },
          {
            path: "new",
            name: "quranQuestions.create",
            component: async () => import("@/pages/quranQuestions/Create.vue"),
          },
          {
            path: ":quranQuestionId",
            name: "quranQuestions.view",
            component: async () => import("@/pages/quranQuestions/View.vue"),
          },
          {
            path: ":quranQuestionId/edit",
            name: "quranQuestions.edit",
            component: async () => import("@/pages/quranQuestions/Edit.vue"),
          },
        ],
      },
      {
        path: "universities",
        name: "universities",
        children: [
          {
            path: "",
            name: "universities.index",
            component: async () => import("@/pages/universities/Index.vue"),
          },
          {
            path: "new",
            name: "universities.create",
            component: async () => import("@/pages/universities/Create.vue"),
          },
          {
            path: ":universityId",
            name: "universities.edit",
            component: async () => import("@/pages/universities/Edit.vue"),
          },
        ],
      },
      {
        path: "faculties",
        name: "faculties",
        children: [
          {
            path: "",
            name: "faculties.index",
            component: async () => import("@/pages/faculties/Index.vue"),
          },
          {
            path: "new",
            name: "faculties.create",
            component: async () => import("@/pages/faculties/Create.vue"),
          },
          {
            path: ":facultyId",
            name: "faculties.edit",
            component: async () => import("@/pages/faculties/Edit.vue"),
          },
        ],
      },
      {
        path: "departments",
        name: "departments",
        children: [
          {
            path: "",
            name: "departments.index",
            component: async () => import("@/pages/departments/Index.vue"),
          },
          {
            path: "new",
            name: "departments.create",
            component: async () => import("@/pages/departments/Create.vue"),
          },
          {
            path: ":departmentId",
            name: "departments.edit",
            component: async () => import("@/pages/departments/Edit.vue"),
          },
        ],
      },
      {
        path: "countries",
        name: "countries",
        children: [
          {
            path: "",
            name: "countries.index",
            component: async () => import("@/pages/countries/Index.vue"),
          },
          {
            path: ":countryId",
            name: "countries.edit",
            component: async () => import("@/pages/countries/Edit.vue"),
          },
        ],
      },
      {
        path: "cities",
        name: "cities",
        children: [
          {
            path: "",
            name: "cities.index",
            component: async () => import("@/pages/cities/Index.vue"),
          },
          {
            path: "new",
            name: "cities.create",
            component: async () => import("@/pages/cities/Create.vue"),
          },
          {
            path: ":cityId",
            name: "cities.edit",
            component: async () => import("@/pages/cities/Edit.vue"),
          },
        ],
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
      {
        path: "settings",
        name: "settings",
        children: [
          {
            path: "",
            name: "settings.index",
            component: async () => import("@/pages/settings/Index.vue"),
          },
          {
            path: ":settingId",
            name: "settings.edit",
            component: async () => import("@/pages/settings/Edit.vue"),
          },
        ],
      },
      {
        path: "regulations",
        name: "regulations",
        children: [
          {
            path: "",
            name: "regulations.index",
            component: async () => import("@/pages/regulations/Index.vue"),
          },
          {
            path: ":regulation",
            name: "regulations.view",
            component: async () => import("@/pages/regulations/View.vue"),
          },
          {
            path: ":regulation/edit",
            name: "regulations.edit",
            component: async () => import("@/pages/regulations/Edit.vue"),
          },
        ],
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

  if (user.profile.phone_number_verified_at === null && to.name !== 'verify-phone-number') {
    const settingStore = useSettingStore()
    await settingStore.fetchSettings()

    if (settingStore.isSettingOpen('whatsapp-verification-is-active-on-user-registration')) {
      return router.push({ name: 'verify-phone-number' })
    }
  }

  if (to.name !== 'verify-phone-number' && to.name !== 'profile.edit' && !user.profile.gender) {
    const alert = useAlertStore()
    alert.flushMessages()
    alert.addWarningMessage('Lütfen profil bilgilerinizi doldurun!')

    return router.push({ name: 'profile.edit' })
  }

  return true
})

export default router;
