<script setup lang="ts">
import { FormLabel, FormInput } from "@/base-components/Form"
import Button from "@/base-components/Button"
import LoadingIcon from '@/base-components/LoadingIcon'
import TomSelect from '@/base-components/TomSelect'
import { ref, reactive, onBeforeMount, inject, watch } from "vue"
import { useRouter, useRoute } from "vue-router"
import { useUserStore } from "@/stores/user"
import { useUniversityStore } from "@/stores/university"
import _ from "lodash";

const successNotificationToggle = inject('successNotificationToggle')
const isLoading = ref(false)
const router = useRouter()
const route = useRoute()
const departmentId = route.params.departmentId
const user = useUserStore()
const universityStore = useUniversityStore()
const universities = ref([])
const faculties = ref([])
const universityId = ref(null)
const universityFacultyId = ref(null)
const department = ref({
  university_id: null,
  university_faculty_id: null,
  name: '',
})

onBeforeMount(async () => {
  universities.value = await universityStore.fetchUniversities()
  department.value = await universityStore.fetchUniversityFacultyDepartment(departmentId)
  universityId.value = department.value.university_id
  universityFacultyId.value = department.value.university_faculty_id
})

watch(universityId, async (newValue) => {
  faculties.value = await universityStore.fetchUniversityFaculties(newValue)
})

const onSubmit = async () => {
  isLoading.value = true
  department.value.university_id = universityId
  department.value.university_faculty_id = universityFacultyId

  if (await universityStore.updateUniversityFacultyDepartment(departmentId, department.value)) {
    isLoading.value = false
    successNotificationToggle('İşlem Başarılı', 'Bölüm Bilgileri Güncellendi.')
    router.go(-1)
  } else {
    isLoading.value = false
    window.scrollTo(0, 0)
  }
}
</script>

<template>
  <div v-if="user.can('universities.update')">
    <div class="flex items-center mt-8 intro-y">
      <h2 class="mr-auto text-lg font-medium">Üniversite Bölüm Bilgilerini Düzenle</h2>
    </div>
    <div class="grid grid-cols-12 gap-6 mt-5">
      <div class="col-span-12 intro-y lg:col-span-6">
        <div class="intro-y box">
          <div class="flex flex-col items-center p-5 border-b sm:flex-row border-slate-200/60 dark:border-darkmode-400">
            <h2 class="mr-auto text-base font-medium">Bölüm Bilgileri</h2>
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
                <TomSelect
                  v-model="universityId"
                  :options="{ placeholder: 'Üniversite seçin.' }"
                  class="w-full"
                >
                  <option v-for="university in universities" :key="university.id" :value="university.id">
                    {{ university.name }}
                  </option>
                </TomSelect>
              </div>
              <div class="input-form mt-4" >
                <FormLabel htmlFor="name" class="flex flex-col w-full sm:flex-row">
                  Fakülte
                  <span class="mt-1 text-xs sm:ml-auto sm:mt-0 text-slate-500">
                    Zorunlu
                  </span>
                </FormLabel>
                <TomSelect
                  v-model="universityFacultyId"
                  :options="{ placeholder: 'Fakülte seçin.' }" class="w-full"
                >
                  <option v-for="faculty in faculties" :key="faculty.id" :value="faculty.id">
                    {{ faculty.name }}
                  </option>
                </TomSelect>
              </div>
              <div class="input-form mt-4">
                <FormLabel htmlFor="name" class="flex flex-col w-full sm:flex-row">
                  Bölüm Adı
                  <span class="mt-1 text-xs sm:ml-auto sm:mt-0 text-slate-500">
                    Zorunlu
                  </span>
                </FormLabel>
                <FormInput id="name" v-model="department.name" :value="department.name" type="text" name="name" required
                  placeholder="Bölüm Adını Yazın" />
              </div>

              <Button variant="primary" type="submit" class="w-1/2 mt-5 mr-2" :disabled="isLoading">
                <LoadingIcon v-show="isLoading" icon="oval" color="white" class="w-4 h-4 mr-5" />
                Kaydet
              </Button>
              <Button
                variant="outline-secondary"
                type="button"
                class="mt-5 mr-5"
                @click="() => router.go(-1)"
              >
                İptal
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
