<script setup lang="ts">
import { useRoute, useRouter } from "vue-router";
import Divider from "./Divider.vue";
import Menu from "./Menu.vue";
import TopBar from "../../components/TopBar";
import DarkModeSwitcher from "../../components/DarkModeSwitcher";
import MobileMenu from "../../components/MobileMenu";
import { useSideMenuStore } from "../../stores/side-menu";
import { useUserStore } from "@/stores/user";
import { useSettingStore } from "@/stores/setting";
import { FormattedMenu, nestedMenu, enter, leave } from "./side-menu";
import {
  watch,
  reactive,
  computed,
  onMounted,
  onBeforeMount,
  provide
} from "vue";

const route = useRoute()
const router = useRouter()
const user = useUserStore()
const settingStore = useSettingStore()
const settings = computed(() => settingStore.getSettings);
let formattedMenu = reactive<Array<FormattedMenu | "divider">>([]);
const setFormattedMenu = (
  computedFormattedMenu: Array<FormattedMenu | "divider">
) => {
  Object.assign(formattedMenu, computedFormattedMenu);
};
const sideMenuStore = useSideMenuStore();
const sideMenu = computed(() => nestedMenu(sideMenuStore.menu, route));

provide('user', user)

watch(sideMenu, () => {
  setFormattedMenu(sideMenu.value)
});

onBeforeMount(async () => {
  await settingStore.fetchSettings()

  if (user.profile.phone_number_verified_at === null &&
    settingStore.isSettingOpen('whatsapp-verification-is-active-on-user-registration')
  ) {
    return router.push({ name: 'verify-phone-number' })
  }

  if (!user.profile.gender) {
    console.log('cinsiyet boş, profil doğrulamaya gidecek, burası içerde çalışacak.')
  }

  if (localStorage.getItem('newCourseRegisterType')) {
    console.log('kullanıcı yeni kursa kayıt olmak istiyor!')
  }
});

onMounted(() => {
  setFormattedMenu(sideMenu.value);
});
</script>

<template>
  <div class="py-5 md:py-0">
    <DarkModeSwitcher />
    <MobileMenu />
    <TopBar layout="side-menu" />
    <div class="flex overflow-hidden">
      <!-- BEGIN: Side Menu -->
      <nav
        class="w-[105px] xl:w-[260px] px-5 pb-16 overflow-x-hidden z-50 pt-32 -mt-4 hidden md:block"
      >
        <ul>
          <!-- BEGIN: First Child -->
          <template v-for="(menu, menuKey) in formattedMenu">
            <Divider
              v-if="menu == 'divider'"
              type="li"
              :class="[
                'my-6',

                // Animation
                `opacity-0 animate-[0.4s_ease-in-out_0.1s_intro-divider] animate-fill-mode-forwards`,
              ]"
              :key="'divider-' + menuKey"
            ></Divider>
            <li v-else-if="!menu.ignore && user.can(menu.permission)" :key="menuKey">
              <Menu
                :class="{
                  // Animation
                  [`opacity-0 translate-x-[50px] animate-[0.4s_ease-in-out_0.1s_intro-menu] animate-fill-mode-forwards`]: !menu.active,
                }"
                :menu="menu"
                :formattedMenuState="[formattedMenu, setFormattedMenu]"
                level="first"
              ></Menu>
              <!-- BEGIN: Second Child -->
              <Transition @enter="enter" @leave="leave">
                <ul
                  v-if="menu.subMenu && menu.activeDropdown"
                  :class="[
                    'bg-white/[0.04] rounded-xl relative dark:bg-transparent',
                    'before:content-[\'\'] before:block before:inset-0 before:bg-white/30 before:rounded-xl before:absolute before:z-[-1] before:dark:bg-darkmode-900/30',
                    { block: menu.activeDropdown },
                    { hidden: !menu.activeDropdown },
                  ]"
                >
                  <li
                    v-for="(subMenu, subMenuKey) in menu.subMenu"
                    :key="subMenuKey"
                  >
                    <Menu
                      :class="{
                        // Animation
                        [`opacity-0 translate-x-[50px] animate-[0.4s_ease-in-out_0.1s_intro-menu] animate-fill-mode-forwards`]: !subMenu.active,
                      }"
                      :menu="subMenu"
                      :formattedMenuState="[formattedMenu, setFormattedMenu]"
                      level="second"
                    ></Menu>
                    <!-- BEGIN: Third Child -->
                    <Transition
                      @enter="enter"
                      @leave="leave"
                      v-if="subMenu.subMenu"
                    >
                      <ul
                        v-if="subMenu.subMenu && subMenu.activeDropdown"
                        :class="[
                          'bg-white/[0.04] rounded-xl relative dark:bg-transparent',
                          'before:content-[\'\'] before:block before:inset-0 before:bg-white/30 before:rounded-xl before:absolute before:z-[-1] before:dark:bg-darkmode-900/30',
                          { block: subMenu.activeDropdown },
                          { hidden: !subMenu.activeDropdown },
                        ]"
                      >
                        <li
                          v-for="(
                            lastSubMenu, lastSubMenuKey
                          ) in subMenu.subMenu"
                          :key="lastSubMenuKey"
                        >
                          <Menu
                            :class="{
                              // Animation
                              [`opacity-0 translate-x-[50px] animate-[0.4s_ease-in-out_0.1s_intro-menu] animate-fill-mode-forwards`]: !lastSubMenu.active,
                            }"
                            :menu="lastSubMenu"
                            :formattedMenuState="[
                              formattedMenu,
                              setFormattedMenu,
                            ]"
                            level="third"
                          ></Menu>
                        </li>
                      </ul>
                    </Transition>
                    <!-- END: Third Child -->
                  </li>
                </ul>
              </Transition>
              <!-- END: Second Child -->
            </li>
          </template>
          <!-- END: First Child -->
        </ul>
      </nav>
      <!-- END: Side Menu -->
      <!-- BEGIN: Content -->
      <div
        :class="[
          'max-w-full md:max-w-none rounded-[30px] md:rounded-none px-4 md:px-[22px] min-w-0 min-h-screen bg-slate-100 flex-1 md:pt-20 pb-10 mt-5 md:mt-1 relative dark:bg-darkmode-700',
          'before:content-[\'\'] before:w-full before:h-px before:block',
        ]"
      >
        <RouterView />
      </div>
      <!-- END: Content -->
    </div>
  </div>
</template>
