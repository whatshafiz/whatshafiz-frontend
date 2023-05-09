<script setup lang="ts">
import { useUserStore } from "@/stores/user"
import { useRouter } from "vue-router"
import Button from "@/base-components/Button"
import userProfile from "@/assets/images/placeholders/user.png"
import maleProfile from "@/assets/images/placeholders/male.jpg"
import femaleProfile from "@/assets/images/placeholders/female.jpg"

const user = useUserStore()
const router = useRouter()
const props = defineProps({
  user: {
    type: Object,
    required: true,
  },
})
</script>

<template>
  <div class="flex flex-col items-center p-3 lg:flex-row">
    <div class="w-12 h-12 lg:w-12 lg:h-12 image-fit lg:mr-1">
      <img
        alt="Kullanıcı"
        class="rounded-full"
        :src="props.user.gender === 'male' ?
          maleProfile :
          (props.user.gender === 'female' ? femaleProfile : userProfile)"
      />
    </div>
    <div class="mt-3 text-center lg:ml-2 lg:mr-auto lg:text-left lg:mt-0">
      <a href="" class="font-medium">
        {{ props.user.name }} {{ props.user.surname }}
      </a>
      <div class="text-slate-500 text-xs mt-0.5">{{ props.user.university_name }}</div>
      <div class="text-slate-500 text-xs mt-0.5">
        {{ props.user.city_name }} {{ props.user.country_name }}
      </div>
    </div>
    <div v-if="props.user.id !== user.profile.id" class="flex mt-4 lg:mt-0">
      <a target="_blank" :href="'https://wa.me/' + props.user.phone_number">
        <Button type="button" variant="primary" class="px-3 py-2 mr-2"> Mesaj Gönder </Button>
      </a>
      <Button
        v-if="user.can('users.view')"
        type="button"
        variant="outline-secondary"
        class="px-3 py-2"
        @click.native="router.push({ name: 'users.view', params: { userId: props.user.id } })"
      >
        Profil
      </Button>
    </div>
  </div>
</template>
