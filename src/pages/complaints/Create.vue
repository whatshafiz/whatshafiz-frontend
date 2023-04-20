<script setup lang="ts">
import { FormLabel, FormInput, FormTextarea } from "@/base-components/Form"
import Button from "@/base-components/Button"
import LoadingIcon from '@/base-components/LoadingIcon'
import UserCard from '@/components/UserCard'
import { ref, reactive, inject, onBeforeMount } from "vue"
import { useRouter, useRoute } from "vue-router"
import { useComplaintsStore } from "@/stores/complaint"
import { useUserStore } from "@/stores/user";
import _ from "lodash";

const successNotificationToggle = inject('successNotificationToggle')
const isLoading = ref(false)
const router = useRouter()
const route = useRoute()
const complaintStore = useComplaintsStore()
const userStore = useUserStore()
const relatedUser = ref({})
const complaint = reactive({
  subject: '',
  description: '',
  related_user_id: '',
})

onBeforeMount(async () => {
  if (route.query.userId) {
    relatedUser.value = await userStore.fetchUser(route.query.userId)
    complaint.related_user_id = relatedUser.value.id
  }
})

const onSubmit = async () => {
  isLoading.value = true

  if (await complaintStore.createComplaint(complaint)) {
    isLoading.value = false
    successNotificationToggle('İşlem Başarılı', 'Şikayet Kaydedildi.')
    router.push({ name: 'my.complaints' })
  } else {
    isLoading.value = false
    window.scrollTo(0, 0)
  }
}
</script>

<template>
  <div>
    <div class="flex items-center mt-8 intro-y">
      <h2 class="mr-auto text-lg font-medium">Yeni Şikayet Kaydı Oluştur</h2>
    </div>
    <div class="grid grid-cols-12 gap-6 mt-5">
      <div class="col-span-12 intro-y lg:col-span-8">
        <div class="intro-y box">
          <div class="flex flex-col items-center p-5 border-b sm:flex-row border-slate-200/60 dark:border-darkmode-400">
            <h2 class="mr-auto text-base font-medium">Şikayet Detayları</h2>
          </div>
          <div class="p-5">
            <form class="validate-form" @submit.prevent="onSubmit">
              <div class="input-form mt-4" v-if="relatedUser.id">
                <FormLabel htmlFor="related_user" class="flex flex-col w-full sm:flex-row">
                  Şikayet Edilen
                </FormLabel>
                <user-card :user="relatedUser" />
              </div>
              <div class="input-form mt-5">
                <FormLabel htmlFor="subject" class="flex flex-col w-full sm:flex-row">
                  Şikayet Konusu
                  <span class="mt-1 text-xs sm:ml-auto sm:mt-0 text-slate-500">
                    Zorunlu
                  </span>
                </FormLabel>
                <FormInput
                  id="subject"
                  v-model="complaint.subject"
                  :value="complaint.subject"
                  type="text"
                  name="subject"
                  required
                  placeholder="Şikayet Konusunu Yazın"
                />
              </div>
              <div class="input-form mt-5">
                <FormLabel htmlFor="description" class="flex flex-col w-full sm:flex-row">
                  Şikayet Açıklaması
                  <span class="mt-1 text-xs sm:ml-auto sm:mt-0 text-slate-500">
                    Zorunlu
                  </span>
                </FormLabel>
                <FormTextarea
                  id="description"
                  v-model="complaint.description"
                  :value="complaint.description"
                  type="text"
                  name="description"
                  required
                  placeholder="Şikayet Açıklamanızı Yazın"
                />
              </div>
              <Button variant="primary" type="submit" class="w-1/2 mt-5 mr-2" :disabled="isLoading">
                <LoadingIcon v-show="isLoading" icon="oval" color="white" class="w-4 h-4 mr-5" />
                Kaydet
              </Button>
              <Button variant="outline-secondary" type="button" class="mt-5 mr-5" @click="() => router.go(-1)">
                İptal
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
