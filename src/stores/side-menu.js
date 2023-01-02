import { defineStore } from "pinia";

export const useSideMenuStore = defineStore("sideMenu", {
  state: () => ({
    menu: [
    {
      icon: "UsersIcon",
      pageName: "side-menu-users",
      title: "Kullanıcı İşlemleri",
      subMenu: [
      {
        icon: "",
        pageName: "side-menu-users-list",
        title: "Kullanıcı Listesi",
      }
      ],
    },
    {
      icon: "UnlockIcon",
      pageName: "side-menu-roles",
      title: "Rol İşlemleri",
      subMenu: [
      {
        icon: "",
        pageName: "side-menu-roles-list",
        title: "Rol Listesi",
      }
      ],
    },
    {
      icon: "SettingsIcon",
      pageName: "side-menu-settings-list",
      title: "Genel Ayarlar",
    },
    
    
    
    ],
  }),
});
