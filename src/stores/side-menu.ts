import { defineStore } from "pinia";
import { Icon } from "../base-components/Lucide/Lucide.vue";

export interface Menu {
  icon: Icon;
  title: string;
  pageName?: string;
  subMenu?: Menu[];
  ignore?: boolean;
}

export interface SideMenuState {
  menu: Array<Menu | "divider">;
}

export const useSideMenuStore = defineStore("sideMenu", {
  state: (): SideMenuState => ({
    menu: [
      {
        icon: "Home",
        pageName: "dashboard",
        title: "Anasayfa",
      },
      {
        icon: "Book",
        pageName: "level-history",
        title: "Okuma Geçmişim",
      },
      "divider",
      {
        icon: "Users",
        pageName: "my-whatsapp-groups",
        title: "Whatsapp Gruplarım",
      },
      {
        icon: "CalendarDays",
        pageName: "my-courses",
        title: "Kurslarım",
      },
      {
        icon: "MailWarning",
        pageName: "my-complaints",
        title: "Şikayetlerim",
      },
      {
        icon: "MessageSquare",
        pageName: "my-comments",
        title: "Yorumlarım",
      },
      "divider",
      {
        icon: "Users",
        pageName: "whatsapp-groups",
        title: "Whatsapp Grupları",
      },
      {
        icon: "CalendarDays",
        pageName: "courses",
        title: "Kurslar",
      },
      {
        icon: "BookOpenCheck",
        pageName: "quran-questions",
        title: "Meal Soruları",
      },
      {
        icon: "MailWarning",
        pageName: "complaints",
        title: "Şikayetler",
      },
      {
        icon: "MessageSquare",
        pageName: "comments",
        title: "Öğrenci Yorumları",
      },
      {
        icon: "GraduationCap",
        pageName: "comments",
        title: "Üniversiteler/Fakülteler",
      },
      {
        icon: "Globe2",
        pageName: "countries",
        title: "Ülkeler/Şehirler",
      },
      {
        icon: "UserCog",
        pageName: "roles",
        title: "Rol/Yetki Yönetimi",
      },
      {
        icon: "Settings",
        pageName: "settings",
        title: "Sistem Ayarları",
      },
      "divider",
      {
        icon: "Scroll",
        pageName: "regulations",
        title: "Yönetmelikler",
      },
      {
        icon: "User",
        pageName: "profile",
        title: "Profil",
      },
      {
        icon: "LogOut",
        pageName: "logout",
        title: "Çıkış Yap",
      },
    ],
  }),
});
