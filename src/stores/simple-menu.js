import { defineStore } from "pinia";

export const useSimpleMenuStore = defineStore("simpleMenu", {
  state: () => ({
    menu: [
      {
        icon: "HomeIcon",
        pageName: "simple-menu-page-1",
        title: "Page 1",
      },
      {
        icon: "HomeIcon",
        pageName: "simple-menu-page-2",
        title: "Page 2",
      },
      {
        icon: "HomeIcon",
        pageName: "auth-login",
        title: "Login Page",
      },
    ],
  }),
});
