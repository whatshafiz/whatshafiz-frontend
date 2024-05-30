import { createRouter, createWebHistory } from "vue-router";
import { useUserStore } from '@/stores/user'
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
        path: "my",
        name: "my",
        children: [
          {
            path: "whatsapp-groups",
            name: "my.whatsappGroups",
            component: async () => import("@/pages/whatsappGroups/Index.vue"),
            meta: { isMyIndex: true },
          },
          {
            path: "courses",
            name: "my.courses",
            component: async () => import("@/pages/courses/Index.vue"),
            meta: { isMyIndex: true },
          },
          {
            path: "complaints",
            name: "my.complaints",
            component: async () => import("@/pages/complaints/Index.vue"),
            meta: { isMyIndex: true },
          },
          {
            path: "comments",
            name: "my.comments",
            component: async () => import("@/pages/comments/Index.vue"),
            meta: { isMyIndex: true },
          },
        ],
      },
      {
        path: "whatsapp-groups",
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
        path: "users",
        name: "users",
        children: [
          {
            path: "",
            name: "users.index",
            component: async () => import("@/pages/users/Index.vue"),
          },
          {
            path: ":userId",
            name: "users.view",
            component: async () => import("@/pages/users/View.vue"),
          },
        ],
      },
      {
        path: "courses",
        name: "courses",
        children: [
          {
            path: "",
            name: "courses.index",
            component: async () => import("@/pages/courses/Index.vue"),
          },
          {
            path: "new",
            name: "courses.create",
            component: async () => import("@/pages/courses/Create.vue"),
          },
          {
            path: ":courseId",
            name: "courses.view",
            component: async () => import("@/pages/courses/View.vue"),
          },
          {
            path: ":courseId/edit",
            name: "courses.edit",
            component: async () => import("@/pages/courses/Edit.vue"),
          },
          {
            path: ":courseType/register",
            name: "courses.register",
            component: async () => import("@/pages/courses/Register.vue"),
          },
        ],
      },
      {
        path: "complaints",
        name: "complaints",
        children: [
          {
            path: "",
            name: "complaints.index",
            component: async () => import("@/pages/complaints/Index.vue"),
          },
          {
            path: "unresolved",
            name: "complaints.index.unresolved",
            component: async () => import("@/pages/complaints/Index.vue"),
            meta: { unresolved: true },
          },
          {
            path: "new",
            name: "complaints.create",
            component: async () => import("@/pages/complaints/Create.vue"),
          },
          {
            path: ":complaintId",
            name: "complaints.view",
            component: async () => import("@/pages/complaints/View.vue"),
          },
          {
            path: ":complaintId/edit",
            name: "complaints.edit",
            component: async () => import("@/pages/complaints/Edit.vue"),
          },
        ],
      },
      {
        path: "comments",
        name: "comments",
        children: [
          {
            path: "",
            name: "comments.index",
            component: async () => import("@/pages/comments/Index.vue"),
          },
          {
            path: "unapproved",
            name: "comments.index.unapproved",
            component: async () => import("@/pages/comments/Index.vue"),
            meta: { unapproved: true },
          },
          {
            path: "new",
            name: "comments.create",
            component: async () => import("@/pages/comments/Create.vue"),
          },
          {
            path: ":commentId",
            name: "comments.view",
            component: async () => import("@/pages/comments/View.vue"),
          },
          {
            path: ":commentId/edit",
            name: "comments.edit",
            component: async () => import("@/pages/comments/Edit.vue"),
          },
        ],
      },
      {
        path: "quran-questions",
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
        path: "courseTypes",
        name: "courseTypes",
        children: [
          {
            path: "",
            name: "courseTypes.index",
            component: async () => import("@/pages/courseTypes/Index.vue"),
          },
          {
            path: "new",
            name: "courseTypes.create",
            component: async () => import("@/pages/courseTypes/Create.vue"),
          },
          {
            path: ":courseTypeId/edit",
            name: "courseTypes.edit",
            component: async () => import("@/pages/courseTypes/Edit.vue"),
          },
          {
            path: ":courseTypeId",
            name: "courseTypes.view",
            component: async () => import("@/pages/courseTypes/View.vue"),
          },
        ],
      },
      {
        path: "whatsappMessenger",
        name: "whatsappMessenger",
        children: [
          {
            path: "",
            name: "whatsappMessenger.index",
            component: async () => import("@/pages/whatsappMessenger/Index.vue"),
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
            path: "new",
            name: "regulations.create",
            component: async () => import("@/pages/regulations/Create.vue"),
          },
          {
            path: ":regulationId/edit",
            name: "regulations.edit",
            component: async () => import("@/pages/regulations/Edit.vue"),
          },
          {
            path: ":regulationId",
            name: "regulations.view",
            component: async () => import("@/pages/regulations/View.vue"),
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
    return router.push({ name: 'profile.edit' })
  }

  return true
})

export default router;
