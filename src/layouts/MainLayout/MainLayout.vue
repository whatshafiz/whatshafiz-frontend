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
    <MobileMenu />
    <div class="flex overflow-hidden">
      <!-- BEGIN: Side Menu -->
      <nav class="w-[105px] xl:w-[260px] px-5 pb-16 overflow-x-hidden z-50 pt-32 -mt-4 hidden md:block">
        <ul>
          <!-- BEGIN: First Child -->

          <!-- END: First Child -->
        </ul>
      </nav>

        <RouterView />
      </div>
      <!-- END: Content -->
  </div>

</div>
</template>
