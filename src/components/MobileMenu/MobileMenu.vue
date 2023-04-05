<script setup lang="ts">
import { useRoute } from "vue-router";
import { useSideMenuStore } from "../../stores/side-menu";
import {
  FormattedMenu,
  nestedMenu,
} from "../../layouts/MainLayout/side-menu";
import { watch, reactive, computed, onMounted, ref } from "vue";
import SimpleBar from "simplebar";

const route = useRoute();
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

</script>

<template>
  <!-- BEGIN: Mobile Menu -->
  <div
  >
  ERKANN
  </div>
  <!-- END: Mobile Menu -->
</template>
