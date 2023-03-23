<script setup lang="ts">
import Button from "@/base-components/Button";
import Lucide from "@/base-components/Lucide";
import { computed } from "vue";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia"
import userProfile from "@/assets/images/placeholders/user.png"
import maleProfile from "@/assets/images/placeholders/male.jpg"
import femaleProfile from "@/assets/images/placeholders/female.jpg"

const userStore = useUserStore()
const { profile } = storeToRefs(userStore)

const userProfileImage = computed(() => {
  return profile.value.gender === 'male' ?
    maleProfile :
    (profile.value.gender === 'female' ? femaleProfile : userProfile)
});

</script>

<template>
  <div class="flex items-center mt-8 intro-y">
    <h2 class="mr-auto text-lg font-medium">Profil Bilgileri</h2>
  </div>
  <!-- BEGIN: Page Layout -->
  <div class="grid md:w-1/2 gap-6 mt-5">
      <div
        class="flex flex-col-reverse col-span-12 lg:col-span-4 2xl:col-span-3 lg:block"
      >
        <div class="mt-5 intro-y box lg:mt-0">
          <div class="relative flex items-center p-5">
            <div class="w-24 h-24 image-fit">
              <img
                alt="WhatsHafız Panel Kullanıcısı"
                class="rounded-full"
                :src="userProfileImage"
              />
            </div>
            <div class="ml-4 mr-auto">
              <div class="text-base font-medium">
                {{ profile.name }} {{ profile.surname }}
              </div>
              <span class="text-slate-500" v-if="profile.phone_number_verified_at === null">
                <i>(Telefon Doğrulanmamış)</i>
              </span>
            </div>
          </div>
          <div class="p-5 border-t border-slate-200/60 dark:border-darkmode-400">
            <span class="flex items-center font-medium text-primary" href="">
              <Lucide icon="Mail" class="w-4 h-4 mr-2" /> İletişim Bilgileri
            </span>
            <span class="flex items-center mt-5" href="">
              <Lucide icon="Phone" class="w-4 h-4 mr-2" /> {{ profile.phone_number }} 
            </span>
            <span class="flex items-center mt-5" href="">
              <Lucide icon="Navigation" class="w-4 h-4 mr-2" /> {{ profile.city?.name }}
            </span>
            <span class="flex items-center mt-5" href="">
              <Lucide icon="Map" class="w-4 h-4 mr-2" /> {{ profile.country?.name }}
            </span>
          </div>
          <div class="p-5 border-t border-slate-200/60 dark:border-darkmode-400">
            <span class="flex items-center font-medium text-primary" href="">
              <Lucide icon="Activity" class="w-4 h-4 mr-2" /> Eğitim Bilgileri
            </span>
            <span class="flex items-center mt-5" href="">
              <Lucide icon="Box" class="w-4 h-4 mr-2" /> {{ profile.university?.name }}
            </span>
            <span class="flex items-center mt-5" href="">
              <Lucide icon="Lock" class="w-4 h-4 mr-2" /> {{ profile.university_faculty?.name }}
            </span>
            <span class="flex items-center mt-5" href="">
              <Lucide icon="Settings" class="w-4 h-4 mr-2" /> {{ profile.university_department?.name }}
            </span>
          </div>
          <div
            class="flex p-5 border-t border-slate-200/60 dark:border-darkmode-400"
          >
            <RouterLink :to="{ name: 'profile.edit' }">
              <Button variant="outline-secondary" class="flex">
                <Lucide icon="Edit" class="w-4 h-4 mr-2" /> Düzenle
              </Button>
            </RouterLink>
          </div>
        </div>
      </div>

  </div>
  <!-- END: Page Layout -->
</template>
