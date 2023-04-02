<script setup lang="ts">
import { FormLabel, FormInput } from "@/base-components/Form"
import Button from "@/base-components/Button"
import LoadingIcon from '@/base-components/LoadingIcon'
import TomSelect from '@/base-components/TomSelect'
import { ref, reactive, onBeforeMount, inject } from "vue"
import { useRouter, useRoute } from "vue-router"
import { useUserStore } from "@/stores/user"
import { useUniversityStore } from "@/stores/university"
import _ from "lodash";

const successNotificationToggle = inject('successNotificationToggle')
const isLoading = ref(false)
const router = useRouter()
const route = useRoute()
const facultyId = route.params.facultyId
const user = useUserStore()
const universityStore = useUniversityStore()
const universities = ref([])
const faculty = ref({})

onBeforeMount(async () => {
  universities.value = await universityStore.fetchUniversities()
  faculty.value = await universityStore.fetchUniversityFaculty(facultyId)
})

const onSubmit = async () => {
  isLoading.value = true

  if (await universityStore.updateUniversityFaculty(facultyId, faculty.value)) {
    isLoading.value = false
    successNotificationToggle('İşlem Başarılı', 'Fakülte Bilgileri Güncellendi.')
    router.push({ name: 'faculties.index' })
  } else {
    isLoading.value = false
    window.scrollTo(0, 0)
  }
}
</script>

<template>
  <div v-if="user.can('universities.update')">
    <div class="flex items-center mt-8 intro-y">
      <h2 class="mr-auto text-lg font-medium">Fakülte Bilgilerini Düzenle</h2>
    </div>
    <div class="grid grid-cols-12 gap-6 mt-5">
      <div class="col-span-12 intro-y lg:col-span-6">
        <div class="intro-y box">
          <div class="flex flex-col items-center p-5 border-b sm:flex-row border-slate-200/60 dark:border-darkmode-400">
            <h2 class="mr-auto text-base font-medium">Fakülte Bilgileri</h2>
          </div>
          <div class="p-5">
            <form class="validate-form" @submit.prevent="onSubmit">
              <div class="input-form" v-if="universities.length > 0">
                <FormLabel htmlFor="name" class="flex flex-col w-full sm:flex-row">
                  Üniversite
                  <span class="mt-1 text-xs sm:ml-auto sm:mt-0 text-slate-500">
                    Zorunlu
                  </span>
                </FormLabel>
                <TomSelect v-model="faculty.university_id" :options="{ placeholder: 'Üniversite seçin.' }" class="w-full">
                  <option v-for="university in universities" :key="university.id" :value="university.id">
                    {{ university.name }}
                  </option>
                </TomSelect>
              </div>
              <div class="input-form mt-4">
                <FormLabel htmlFor="name" class="flex flex-col w-full sm:flex-row">
                  Fakülte Adı
                  <span class="mt-1 text-xs sm:ml-auto sm:mt-0 text-slate-500">
                    Zorunlu
                  </span>
                </FormLabel>
                <FormInput id="name" v-model="faculty.name" :value="faculty.name" type="text" name="name" required
                  placeholder="Fakülte Adını Yazın" />
              </div>

              <Button variant="primary" type="submit" class="w-1/2 mt-5 mr-2" :disabled="isLoading">
                <LoadingIcon v-show="isLoading" icon="oval" color="white" class="w-4 h-4 mr-5" />
                Kaydet
              </Button>
              <RouterLink :to="{ name: 'faculties.index' }">
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
