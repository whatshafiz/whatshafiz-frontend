<script setup lang="ts">
import { useRoute } from "vue-router";
import { twMerge } from "tailwind-merge";
import logoUrl from "@/assets/images/logo-transparent.png"
import Divider from "./Divider.vue";
import Menu from "./Menu.vue";
import Lucide from "../../base-components/Lucide";
import { useSideMenuStore } from "../../stores/side-menu";
import {
  FormattedMenu,
  nestedMenu,
  enter,
  leave,
} from "../../layouts/MainLayout/side-menu";
import { watch, reactive, computed, onMounted, ref } from "vue";
import SimpleBar from "simplebar";
import { useUserStore } from "@/stores/user";

const route = useRoute();
const user = useUserStore()
let formattedMenu = reactive<Array<FormattedMenu | "divider">>([]);
const setFormattedMenu = (
  computedFormattedMenu: Array<FormattedMenu | "divider">
) => {
  Object.assign(formattedMenu, computedFormattedMenu);
};
const sideMenuStore = useSideMenuStore();
const sideMenu = computed(() => nestedMenu(sideMenuStore.menu, route));

const activeMobileMenu = ref(false);
const setActiveMobileMenu = (active: boolean) => {
  activeMobileMenu.value = active;
};

const scrollableRef = ref<HTMLDivElement>();

watch(sideMenu, () => {
  setFormattedMenu(sideMenu.value);
});

onMounted(() => {
  if (scrollableRef.value) {
    new SimpleBar(scrollableRef.value);
  }

  setFormattedMenu(sideMenu.value);
});
</script>

<template>
  <!-- BEGIN: Mobile Menu -->
  <div
    :class="[
      'w-full fixed bg-primary/90 z-[60] border-b border-white/[0.08] -mt-5 -mx-3 sm:-mx-8 mb-6 dark:bg-darkmode-800/90 md:hidden',
      'before:content-[\'\'] before:w-full before:h-screen before:z-10 before:fixed before:inset-x-0 before:bg-black/90 before:transition-opacity before:duration-200 before:ease-in-out',
      !activeMobileMenu && 'before:invisible before:opacity-0',
      activeMobileMenu && 'before:visible before:opacity-100',
    ]"
  >
    <div class="h-[70px] px-3 sm:px-8 flex items-center justify-center">
      <RouterLink
        :to="{ name: 'dashboard' }"
        class="mx-auto"
      >
        <img
          alt="WhatsHafız"
          class="h-[70px]"
          :src="logoUrl"
        />
      </RouterLink>

      <a href="#" @click="(e) => e.preventDefault()">
        <Lucide
          icon="BarChart2"
          class="w-8 h-8 text-white transform -rotate-90"
          @click="
            () => {
              setActiveMobileMenu(!activeMobileMenu);
            }
          "
        />
      </a>
    </div>
    <div
      ref="scrollableRef"
      :class="
        twMerge([
          'h-screen z-20 top-0 left-0 w-[270px] -ml-[100%] bg-primary transition-all duration-300 ease-in-out dark:bg-darkmode-800',
          '[&[data-simplebar]]:fixed [&_.simplebar-scrollbar]:before:bg-black/50',
          activeMobileMenu && 'ml-0',
        ])
      "
    >
      ERKANNNN
    </div>
  </div>
  <!-- END: Mobile Menu -->
</template>
