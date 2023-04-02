<script setup lang="ts">
import { FormLabel, FormInput } from "@/base-components/Form"
import Button from "@/base-components/Button"
import LoadingIcon from '@/base-components/LoadingIcon'
import { ref, onMounted, inject } from "vue"
import { useRouter, useRoute } from "vue-router"
import { useUserStore } from "@/stores/user"
import { useSettingStore } from "@/stores/setting"

const successNotificationToggle = inject('successNotificationToggle')
const isLoading = ref(false)
const router = useRouter()
const route = useRoute()
const user = useUserStore()
const settingStore = useSettingStore()
const settingId = route.params.settingId
const setting = ref({})

onMounted(async () => {  
  setting.value = await settingStore.fetchSetting(settingId)
})

const onSubmit = async () => {
  isLoading.value = true

  try {
    await settingStore.updateSetting(settingId, setting.value)
    isLoading.value = false
    successNotificationToggle('İşlem Başarılı', 'Ayar güncellendi.')
    router.push({ name: 'settings.index' })
  } catch (response) {
    isLoading.value = false
    window.scrollTo(0, 0)
  }
};
</script>

<template>
  <div v-if="user.hasRole('Admin')">
    <div class="flex items-center mt-8 intro-y">
      <h2 class="mr-auto text-lg font-medium">Sistem Ayarları</h2>
    </div>
    <div class="grid grid-cols-12 gap-6 mt-5">
      <div class="col-span-12 intro-y lg:col-span-6">
        <div class="intro-y box">
          <div class="flex flex-col items-center p-5 border-b sm:flex-row border-slate-200/60 dark:border-darkmode-400">
            <h2 class="mr-auto text-base font-medium">Sistem Ayarı Düzenle</h2>
          </div>
          <div class="p-5">
            <form class="validate-form" @submit.prevent="onSubmit">
              <div class="input-form">
                <FormLabel htmlFor="name" class="flex flex-col w-full sm:flex-row">
                  Adı
                  <span class="mt-1 text-xs sm:ml-auto sm:mt-0 text-slate-500">
                    Zorunlu
                  </span>
                </FormLabel>
                <FormInput id="name" v-model="setting.name" :value="setting.name" type="text" name="name" required
                  placeholder="Ayar Adı Yazın" />
              </div>
              <div class="input-form mt-4">
                <FormLabel htmlFor="value" class="flex flex-col w-full sm:flex-row">
                  Değeri
                  <span class="mt-1 text-xs sm:ml-auto sm:mt-0 text-slate-500">
                    Zorunlu
                  </span>
                </FormLabel>
                <FormInput id="value" v-model="setting.value" :value="setting.value" type="text" name="value" required
                  placeholder="Ayar Değerini Yazın" />
              </div>


              <Button variant="primary" type="submit" class="w-1/2 mt-5 mr-2" :disabled="isLoading">
                <LoadingIcon v-show="isLoading" icon="oval" color="white" class="w-4 h-4 mr-5" />
                Kaydet
              </Button>
              <RouterLink :to="{ name: 'settings.index' }">
                <Button variant="outline-secondary" type="button" class="mt-5 mr-5">
                  İptal
                </Button>
              </RouterLink>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
