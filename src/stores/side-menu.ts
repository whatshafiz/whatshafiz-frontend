import { defineStore } from "pinia";
import { Icon } from "../base-components/Lucide/Lucide.vue";

export interface Menu {
  icon: Icon;
  title: string;
  pageName?: string;
  subMenu?: Menu[];
  ignore?: boolean;
  permission?: string;
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
        permission: "levelHistory.list",
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
        permission: "whatsappGroups.list",
      },
      {
        icon: "CalendarDays",
        pageName: "courses",
        title: "Kurslar",
        permission: "courses.list",
      },
      {
        icon: "BookOpenCheck",
        pageName: "quran-questions",
        title: "Meal Soruları",
        permission: "quranQuestions.list",
      },
      {
        icon: "MailWarning",
        pageName: "complaints",
        title: "Şikayetler",
        permission: "complaints.list",
      },
      {
        icon: "MessageSquare",
        pageName: "comments",
        title: "Öğrenci Yorumları",
        permission: "comments.list",
      },
      {
        icon: "GraduationCap",
        pageName: "universities",
        title: "Üniversiteler/Fakülteler",
        permission: "universities.update",
      },
      {
        icon: "Globe2",
        pageName: "countries",
        title: "Ülkeler/Şehirler",
        permission: "countries.update",
      },
      {
        icon: "UserCog",
        pageName: "roles",
        title: "Rol/Yetki Yönetimi",
        permission: "roles.update",
      },
      {
        icon: "Settings",
        pageName: "settings",
        title: "Sistem Ayarları",
        permission: "settings.update",
        ignore: true,
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
