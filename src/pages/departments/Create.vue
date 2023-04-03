<script setup lang="ts">
import { FormLabel, FormInput } from "@/base-components/Form"
import Button from "@/base-components/Button"
import LoadingIcon from '@/base-components/LoadingIcon'
import TomSelect from '@/base-components/TomSelect'
import { ref, reactive, onBeforeMount, inject, watch } from "vue"
import { useRouter } from "vue-router"
import { useUserStore } from "@/stores/user"
import { useUniversityStore } from "@/stores/university"
import _ from "lodash";

const successNotificationToggle = inject('successNotificationToggle')
const isLoading = ref(false)
const router = useRouter()
const user = useUserStore()
const universityStore = useUniversityStore()
const universities = ref([])
const faculties = ref([])
const universityId = ref(null)
const department = reactive({
  university_id: null,
  faculty_id: null,
  name: '',
})

onBeforeMount(async () => {
  universities.value = await universityStore.fetchUniversities()
})

watch(universityId, async (newValue) => {
  if (newValue) {
    department.university_id = newValue
    faculties.value = await universityStore.fetchUniversityFaculties(newValue)
  }
}, { immediate: true })

const onSubmit = async () => {
  isLoading.value = true

  if (await universityStore.createUniversityFacultyDepartment(department.university_id, department.faculty_id, department.name)) {
    isLoading.value = false
    successNotificationToggle('İşlem Başarılı', 'Yeni Bölüm Oluşturuldu.')
    router.push({ name: 'departments.index' })
  } else {
    isLoading.value = false
    window.scrollTo(0, 0)
  }
}
</script>

<template>
  <div v-if="user.can('universities.update')">
    <div class="flex items-center mt-8 intro-y">
      <h2 class="mr-auto text-lg font-medium">Yeni Üniversite Bölümü Oluştur</h2>
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
                  :options="{ placeholder: 'Üniversite seçin.' }" class="w-full"
                >
                  <option v-for="university in universities" :key="university.id" :value="university.id">
                    {{ university.name }}
                  </option>
                </TomSelect>
              </div>
              <div class="input-form mt-4" v-if="faculties.length > 0">
                <FormLabel htmlFor="name" class="flex flex-col w-full sm:flex-row">
                  Üniversite
                  <span class="mt-1 text-xs sm:ml-auto sm:mt-0 text-slate-500">
                    Zorunlu
                  </span>
                </FormLabel>
                <TomSelect
                  v-model="department.faculty_id"
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
