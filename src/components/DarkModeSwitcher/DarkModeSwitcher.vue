<script setup lang="ts">
import { useDarkModeStore } from "../../stores/dark-mode";
import { computed } from "vue";
import Lucide from "@/base-components/Lucide";

const darkMode = computed(() => useDarkModeStore().darkMode);

const setDarkModeClass = () => {
  const el = document.querySelectorAll("html")[0];
  darkMode.value ? el.classList.add("dark") : el.classList.remove("dark");
};

const switchMode = () => {
  useDarkModeStore().setDarkMode(!darkMode.value);
  setDarkModeClass();
};

setDarkModeClass();
</script>

<template>
  <!-- BEGIN: Dark Mode Switcher -->
  <div
    class="fixed bottom-0 right-0 z-50 flex items-center justify-center w-20 h-12 mb-1 mr-1 border rounded-full shadow-md cursor-pointer box"
    @click="switchMode"
  >
    <Lucide icon="Moon" class="w-4 h-4 mr-2" />
    <div
      :class="[
        'border w-[38px] h-[24px] p-px outline-none rounded-full relative cursor-pointer',
        'before:content-[\'\'] before:w-[22px] before:h-[22px] before:transition-all before:duration-200 before:shadow-[1px_1px_3px_rgba(0,0,0,0.25)] before:absolute before:inset-y-0 before:my-auto before:rounded-full',
        {
          'bg-primary border-primary': darkMode,
          'before:ml-[13px] before:bg-white': darkMode,
        },
      ]"
    ></div>
  </div>
  <!-- END: Dark Mode Switcher -->
</template>
