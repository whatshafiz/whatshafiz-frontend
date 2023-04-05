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
import { useUserStore } from "@/stores/user";
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

const successNotificationTitle = ref<string | null>('')
const successNotificationMessage = ref<string | null>('')
const successNotification = ref<NotificationElement>();
const successNotificationToggle = (title: null | string, message: null | string) => {
  successNotificationTitle.value = title
  successNotificationMessage.value = message
  successNotification.value?.showToast();
};
provide("bind[successNotification]", (el: NotificationElement) => {
  successNotification.value = el;
});
provide('successNotificationToggle', successNotificationToggle)

const warningNotificationTitle = ref<string | null>('')
const warningNotificationMessage = ref<string | null>('')
const warningNotification = ref<NotificationElement>();
const warningNotificationToggle = (title: null | string, message: null | string) => {
  warningNotificationTitle.value = title
  warningNotificationMessage.value = message
  warningNotification.value?.showToast();
};
provide("bind[warningNotification]", (el: NotificationElement) => {
  warningNotification.value = el;
});
provide('warningNotificationToggle', warningNotificationToggle)

const errorNotificationTitle = ref<string | null>('')
const errorNotificationMessage = ref<string | null>('')
const errorNotification = ref<NotificationElement>();
const errorNotificationToggle = (title: null | string, message: null | string) => {
  errorNotificationTitle.value = title
  errorNotificationMessage.value = message
  errorNotification.value?.showToast();
};
provide("bind[errorNotification]", (el: NotificationElement) => {
  errorNotification.value = el;
});
provide('errorNotificationToggle', errorNotificationToggle)

const route = useRoute()
const router = useRouter()
const user = useUserStore()
const alertStore = useAlertStore()
let formattedMenu = reactive<Array<FormattedMenu | "divider">>([]);
const setFormattedMenu = (
  computedFormattedMenu: Array<FormattedMenu | "divider">
) => {
  Object.assign(formattedMenu, computedFormattedMenu);
};
const sideMenuStore = useSideMenuStore();
const sideMenu = computed(() => nestedMenu(sideMenuStore.menu, route));

watch(sideMenu, () => {
  setFormattedMenu(sideMenu.value)
});

onBeforeMount(async () => {
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
  </div>
  <Notification refKey="successNotification" :options="{ duration: 3000 }" class="flex">
    <Lucide icon="CheckCircle" class="text-success" />
    <div class="ml-4 mr-4">
      <div class="font-medium">{{ successNotificationTitle }}</div>
      <div class="mt-1 text-slate-500">{{ successNotificationMessage }}</div>
    </div>
  </Notification>
  <Notification refKey="warningNotification" :options="{ duration: 3000 }" class="flex">
    <Lucide icon="AlertTriangle" class="text-warning" />
    <div class="ml-4 mr-4">
      <div class="font-medium">{{ warningNotificationTitle }}</div>
      <div class="mt-1 text-slate-500">{{ warningNotificationMessage }}</div>
    </div>
  </Notification>
  <Notification refKey="errorNotification" :options="{ duration: 3000 }" class="flex">
    <Lucide icon="AlertOctagon" class="text-danger" />
    <div class="ml-4 mr-4">
      <div class="font-medium">{{ errorNotificationTitle }}</div>
      <div class="mt-1 text-slate-500">{{ errorNotificationMessage }}</div>
    </div>
  </Notification>
  <Dialog :open="alertStore.deleteModalPreview" @close="() => alertStore.setDeleteModalPreview(false)">
    <Dialog.Panel>
      <div class="p-5 text-center">
        <Lucide icon="XCircle" class="w-16 h-16 mx-auto mt-3 text-danger" />
        <div class="mt-5 text-3xl">Dikkat!</div>
        <div class="mt-2 text-slate-500">
          Silmek istediğinizden emin misiniz? <br />
          Bu işlem geri alınamaz!
        </div>
      </div>
      <div class="px-5 pb-8 text-center">
        <Button type="button" variant="outline-secondary" class="w-24 mr-4"
          @click="() => alertStore.setDeleteModalPreview(false)">
          İptal
        </Button>
        <Button type="button" variant="danger" class="w-24" @click="() => {
          alertStore.getDeleteModalAction()
          alertStore.setDeleteModalPreview(false)
          alertStore.setDeleteModalAction(() => { })
        }
        ">
          Sil
        </Button>
      </div>
    </Dialog.Panel>
  </Dialog>
</template>
