import { createRouter, createWebHistory } from "vue-router";

import { useAuthStore } from "@/stores/auth";

import SideMenu from "../layouts/side-menu/Main.vue";
import SimpleMenu from "../layouts/simple-menu/Main.vue";
import TopMenu from "../layouts/top-menu/Main.vue";
import NotFoundComponent from "../views/error/PageNotFound.vue";
import AuthLogin from "../views/auth/login/Main.vue";
import AuthRegister from "../views/auth/register/Main.vue";
import AuthForgotPassword from "../views/auth/forgotpassword/Main.vue";
import AuthRenewPassword from "../views/auth/renewpassword/Main.vue";
import AuthVerifyUser from "../views/auth/verify/Main.vue";
import UserList from "../views/users/List.vue";
import UserDetail from "../views/users/Detail.vue";
import UserCreate from "../views/users/Create.vue";

import RolesList from "../views/roles/List.vue";
import RolesDetail from "../views/roles/Detail.vue";

import SettingsList from "../views/settings/Main.vue";
import CompleteProfile from "../views/auth/complete-profile/Main.vue";




const routes = [
{
  path: "/",
  component: SideMenu,
  children: [
  {
    path: "users",
    name: "side-menu-users",
    children: [
    {
      path: "list",
      name: "side-menu-users-list",
      component: UserList
    },
    {
      path: ":id",
      name: "side-menu-users-user-detail",
      component: UserDetail,
      props: true
    },
    {
      path: "create",
      name: "side-menu-users-user-create",
      component: UserCreate,
    }
    ]
  },
  {
    path: "roles",
    name: "side-menu-roles",
    children: [
    {
      path: "list",
      name: "side-menu-roles-list",
      component: RolesList
    },
    {
      path: ":id",
      name: "side-menu-roles-detail",
      component: RolesDetail,
      props: true
    }
    ]
  },
  {
    path: "settings",
    name: "side-menu-settings",
    children: [
    {
      path: "",
      name: "side-menu-settings-list",
      component: SettingsList
    }
    ]
  },



  ],
  meta:{
    requireAuth: true,

  }
},
{
  path: "/simple-menu",
  component: SimpleMenu,
  children: [],
  meta:{
    requireAuth: true,

  }
},
{
  path: "/top-menu",
  component: TopMenu,
  children: [],
  meta:{
    requireAuth: true,
    

  }
},
{
  path: "/auth/login",
  name: "auth-login",
  component: AuthLogin,
  meta: {
    authPage: true
  }
},
{
  path: "/auth/register",
  name: "auth-register",
  component: AuthRegister,
  meta: {
    authPage: true
  }
},
{
  path: "/auth/forgot-password",
  name: "forgot-password",
  component: AuthForgotPassword,
  meta: {
    authPage: true
  }
},
{
  path: "/auth/renew-password/:token",
  name: "renew-password",
  component: AuthRenewPassword,
  meta: {
    authPage: true
  }
},
{
  path: "/auth/verify",
  name: "verify-user",
  component: AuthVerifyUser,
  meta: {
    requireAuth: true
  }
},
{
  name: "not-found",
  path: '/:pathMatch(.*)',
  component: NotFoundComponent,
  meta: {
    errorPage: true
  }
}

];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    return savedPosition || {left: 0, top: 0};
  },
});

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();


  if (to.meta.errorPage) {
    next();
  }
  if (to.meta.requireAuth) {

    await authStore.getUser();

    if (authStore.user && authStore.user.is_banned === 0 ) {
      next();
    } 



    else {
      next({name: 'auth-login'});
    }
  }

  if (to.meta.authPage) {
    await authStore.getUser();

    if (!authStore.user) {
      next();
      return;
    } else {
      next('/');
    }
  }


});


export default router;
