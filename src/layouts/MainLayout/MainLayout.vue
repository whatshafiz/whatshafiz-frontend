<script setup lang="ts">
import { useRoute, useRouter } from "vue-router";
import Divider from "./Divider.vue";
import Menu from "./Menu.vue";
import TopBar from "../../components/TopBar";
import Alert from "@/base-components/Alert";
import Lucide from "@/base-components/Lucide";
import DarkModeSwitcher from "../../components/DarkModeSwitcher";
import MobileMenu from "../../components/MobileMenu";
import { useSideMenuStore } from "../../stores/side-menu";
import { useAlertStore } from "@/stores/alert";
import { FormattedMenu, nestedMenu, enter, leave } from "./side-menu";
import Notification from "@/base-components/Notification";
import Button from "@/base-components/Button";
import { NotificationElement } from "@/base-components/Notification";
import {
  ref,
  watch,
  reactive,
  computed,
  onMounted,
  onBeforeMount,
  provide
} from "vue";
import { Dialog } from "@/base-components/Headless";

const route = useRoute()
const alertStore = useAlertStore()
</script>

<template>
<div>
  <div class="py-5 md:py-0">
    <DarkModeSwitcher />
    <MobileMenu />
    <TopBar layout="side-menu" />
    <div class="flex overflow-hidden">
      <!-- BEGIN: Side Menu -->
      <nav class="w-[105px] xl:w-[260px] px-5 pb-16 overflow-x-hidden z-50 pt-32 -mt-4 hidden md:block">
        <ul>
          <!-- BEGIN: First Child -->

          <!-- END: First Child -->
        </ul>
      </nav>
      <!-- END: Side Menu -->
      <!-- BEGIN: Content -->
      <div :class="[
        'max-w-full md:max-w-none rounded-[30px] md:rounded-none px-4 md:px-[22px] min-w-0 min-h-screen bg-slate-100 flex-1 md:pt-20 pb-10 mt-5 md:mt-1 relative dark:bg-darkmode-700',
        'before:content-[\'\'] before:w-full before:h-px before:block',
      ]">
        <div v-if="alertStore.hasAlertMessage" class="mt-6">
          <Alert v-if="alertStore.hasSuccessMessage" variant="soft-success" class="items-center mb-2">
            <div v-for="message in alertStore.getSuccessMessages" class="flex items-center">
              <Lucide icon="AlertTriangle" class="w-6 h-6 mr-2" />
              <div class="w-full">{{ message }}</div>
            </div>
          </Alert>

          <Alert v-if="alertStore.hasWarningMessage" variant="soft-warning" class="items-center mb-2">
            <div v-for="message in alertStore.getWarningMessages" class="flex items-center">
              <Lucide icon="AlertCircle" class="w-6 h-6 mr-2" />
              <div class="w-full">{{ message }}</div>
            </div>
          </Alert>

          <Alert v-if="alertStore.hasErrorMessage" variant="soft-danger" class="items-center mb-2">
            <div v-for="message in alertStore.getErrorMessages" class="flex items-center">
              <Lucide icon="AlertOctagon" class="w-6 h-6 mr-2" />
              <div class="w-full">{{ message }}</div>
            </div>
          </Alert>
        </div>
        <RouterView />
      </div>
      <!-- END: Content -->
    </div>
  </div>

</div>
</template>
