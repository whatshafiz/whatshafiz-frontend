<script setup lang="ts">
import Button from "@/base-components/Button";
import Lucide from "@/base-components/Lucide";
import Alert from "@/base-components/Alert";
import { computed, onBeforeMount, ref } from "vue";
import { useRoute } from "vue-router"
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia"
import userProfile from "@/assets/images/placeholders/user.png"
import maleProfile from "@/assets/images/placeholders/male.jpg"
import femaleProfile from "@/assets/images/placeholders/female.jpg"

const userStore = useUserStore()
const { profile } = storeToRefs(userStore)
const route = useRoute()
const user = ref({})

const props = defineProps({
  user: {
    type: Object,
    required: false,
    default: null,
  },
})

onBeforeMount(() => {
  user.value = props.user === null ? profile.value : props.user
})

const userProfileImage = computed(() => {
  return user.value.gender === 'male' ? maleProfile : (user.value.gender === 'female' ? femaleProfile : userProfile)
})
</script>

<template>
  <div class="grid grid-cols-1 mt-5">
    <div class="flex flex-col-reverse col-span-12 lg:col-span-4 2xl:col-span-3 lg:block">
      <div class="mt-5 intro-y box lg:mt-0">
        <div class="p-5 border-b border-slate-200/60 dark:border-darkmode-400">
          <div class="flex items-center intro-y">
            <h2 class="mr-auto text-lg font-medium">Profil Bilgileri</h2>
            <Alert v-if="user.is_banned" variant="soft-danger" class="flex items-center mb-2">
              <Lucide icon="AlertOctagon" class="w-6 h-6 mr-2" />
              BANLI
            </Alert>
          </div>
        </div>
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
              {{ user.name }} {{ user.surname }}
            </div>
            <span class="text-slate-500 text-warning" v-if="user.phone_number_verified_at === null">
              <i>(Telefon Doğrulanmamış)</i>
            </span>
          </div>
        </div>
        <div class="p-5 border-t border-slate-200/60 dark:border-darkmode-400">
          <span class="flex items-center font-medium text-primary" href="">
            <Lucide icon="Mail" class="w-4 h-4 mr-2" /> İletişim Bilgileri
          </span>
          <span class="flex items-center mt-5" href="">
            <Lucide icon="Phone" class="w-4 h-4 mr-2" /> {{ user.phone_number }}
            <a v-if="userStore.profile.id !== user.id"
              class="flex items-center mr-3 text-success"
              target="_blank"
              :href="'https://wa.me/' + user.phone_number"
            >
              <Lucide icon="MessageSquare" class="w-4 h-4 ml-3 mr-1" /> Mesaj Gönder
            </a>
          </span>
          <span class="flex items-center mt-5" href="">
            <Lucide icon="Navigation" class="w-4 h-4 mr-2" /> {{ user.city?.name }}
          </span>
          <span class="flex items-center mt-5" href="">
            <Lucide icon="Map" class="w-4 h-4 mr-2" /> {{ user.country?.name }}
          </span>
        </div>
        <div class="p-5 border-t border-slate-200/60 dark:border-darkmode-400">
          <span class="flex items-center font-medium text-primary" href="">
            <Lucide icon="Activity" class="w-4 h-4 mr-2" /> Eğitim Bilgileri
          </span>
          <span v-if="user.education_level" class="flex items-center mt-5" href="">
            <Lucide icon="GraduationCap" class="w-4 h-4 mr-2" /> {{ user.education_level }}
          </span>
          <span class="flex items-center mt-5" href="">
            <Lucide icon="GraduationCap" class="w-4 h-4 mr-2" /> {{ user.university?.name }}
          </span>
          <span class="flex items-center mt-5" href="">
            <Lucide icon="Boxes" class="w-4 h-4 mr-2" /> {{ user.university_faculty?.name }}
          </span>
          <span class="flex items-center mt-5" href="">
            <Lucide icon="Box" class="w-4 h-4 mr-2" /> {{ user.university_department?.name }}
          </span>
        </div>
        <div
          class="flex p-5 border-t border-slate-200/60 dark:border-darkmode-400"
        >
          <RouterLink v-if="route.name === 'profile'" :to="{ name: 'profile.edit' }">
            <Button variant="outline-secondary" class="flex">
              <Lucide icon="Edit" class="w-4 h-4 mr-2" /> Düzenle
            </Button>
          </RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>
