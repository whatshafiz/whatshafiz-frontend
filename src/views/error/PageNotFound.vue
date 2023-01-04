<template>
  <div>
    <DarkModeSwitcher />
    <div class="container">
      <!-- BEGIN: Error Page -->
      <div
          class="error-page flex flex-col lg:flex-row items-center justify-center h-screen text-center lg:text-left"
      >
        <div class="-intro-x lg:mr-20">
          <img
              alt="ABF Bilişim Hizmetleri"
              class="h-48 lg:h-auto"
              src="@/assets/images/error-illustration.svg"
          />
        </div>
        <div class="text-white mt-10 lg:mt-0">
          <div class="intro-x text-8xl font-medium dark:text-white text-slate-700">404</div>
          <div class="intro-x text-xl lg:text-3xl font-medium mt-5 dark:text-white text-slate-600">
            Bu sayfa bulunamadı.
          </div>
          <div class="intro-x text-lg mt-3 dark:text-white text-slate-600">
            Adresi yanlış yazmış olabilirsiniz ya da sayfa taşınmış olabilir.
          </div>
          <router-link to="/" class="intro-x btn py-3 px-4 border-white dark:border-darkmode-400 text-slate-600 dark:text-white mt-10">
            Anasayfaya Dön
          </router-link>
        </div>
      </div>
      <!-- END: Error Page -->
    </div>
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import DarkModeSwitcher from "@/components/dark-mode-switcher/Main.vue";
import dom from "@left4code/tw-starter/dist/js/dom";

onMounted(() => {
  dom("body").removeClass("main").removeClass("login").addClass("error-page");
});
</script>
