<script setup lang="ts">
import { useRoute, useRouter } from "vue-router";
import Divider from "./Divider.vue";
import Menu from "./Menu.vue";
import TopBar from "@/components/TopBar";
import Alert from "@/base-components/Alert";
import Lucide from "@/base-components/Lucide";
import DarkModeSwitcher from "@/components/DarkModeSwitcher";
import MobileMenu from "@/components/MobileMenu";
import { useSideMenuStore } from "@/stores/side-menu";
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

provide('user', user)

watch(sideMenu, () => {
  setFormattedMenu(sideMenu.value)
});

onBeforeMount(async () => {
  // if (localStorage.getItem('newCourseRegisterType')) {
  //   console.log('kullanıcı yeni kursa kayıt olmak istiyor!')
  // }
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
      <nav class="w-[105px] xl:w-[260px] px-5 pb-16 overflow-x-hidden z-50 pt-32 -mt-4 hidden md:block">
        <ul>
          <!-- BEGIN: First Child -->
          <template v-for="(menu, menuKey) in formattedMenu">
            <Divider v-if="menu == 'divider'" type="li" :class="[
              'my-6',

              // Animation
              `opacity-0 animate-[0.4s_ease-in-out_0.1s_intro-divider] animate-fill-mode-forwards`,
            ]" :key="'divider-' + menuKey"></Divider>
            <li v-else-if="!menu.ignore && user.can(menu.permission)" :key="menuKey">
              <Menu :class="{
                // Animation
                [`opacity-0 translate-x-[50px] animate-[0.4s_ease-in-out_0.1s_intro-menu] animate-fill-mode-forwards`]: !menu.active,
              }" :menu="menu" :formattedMenuState="[formattedMenu, setFormattedMenu]" level="first"></Menu>
              <!-- BEGIN: Second Child -->
              <Transition @enter="enter" @leave="leave">
                <ul v-if="menu.subMenu && menu.activeDropdown" :class="[
                  'bg-white/[0.04] rounded-xl relative dark:bg-transparent',
                  'before:content-[\'\'] before:block before:inset-0 before:bg-white/30 before:rounded-xl before:absolute before:z-[-1] before:dark:bg-darkmode-900/30',
                  { block: menu.activeDropdown },
                  { hidden: !menu.activeDropdown },
                ]">
                  <li v-for="(subMenu, subMenuKey) in menu.subMenu" :key="subMenuKey">
                    <Menu :class="{
                      // Animation
                      [`opacity-0 translate-x-[50px] animate-[0.4s_ease-in-out_0.1s_intro-menu] animate-fill-mode-forwards`]: !subMenu.active,
                    }" :menu="subMenu" :formattedMenuState="[formattedMenu, setFormattedMenu]" level="second"></Menu>
                    <!-- BEGIN: Third Child -->
                    <Transition @enter="enter" @leave="leave" v-if="subMenu.subMenu">
                      <ul v-if="subMenu.subMenu && subMenu.activeDropdown" :class="[
                        'bg-white/[0.04] rounded-xl relative dark:bg-transparent',
                        'before:content-[\'\'] before:block before:inset-0 before:bg-white/30 before:rounded-xl before:absolute before:z-[-1] before:dark:bg-darkmode-900/30',
                        { block: subMenu.activeDropdown },
                        { hidden: !subMenu.activeDropdown },
                      ]">
                        <li v-for="(
                                    lastSubMenu, lastSubMenuKey
                                  ) in subMenu.subMenu" :key="lastSubMenuKey">
                          <Menu :class="{
                            // Animation
                            [`opacity-0 translate-x-[50px] animate-[0.4s_ease-in-out_0.1s_intro-menu] animate-fill-mode-forwards`]: !lastSubMenu.active,
                          }" :menu="lastSubMenu" :formattedMenuState="[
  formattedMenu,
  setFormattedMenu,
]" level="third"></Menu>
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
