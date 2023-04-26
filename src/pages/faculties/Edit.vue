<script setup lang="ts">
import { FormLabel, FormInput } from "@/base-components/Form"
import Button from "@/base-components/Button"
import LoadingIcon from '@/base-components/LoadingIcon'
import Lucide from '@/base-components/Lucide'
import TomSelect from '@/base-components/TomSelect'
import Table from '@/base-components/Table'
import { ref, reactive, onBeforeMount, inject } from "vue"
import { useRouter, useRoute } from "vue-router"
import { useUserStore } from "@/stores/user"
import { useUniversityStore } from "@/stores/university"
import { useAlertStore } from "@/stores/alert";
import _ from "lodash";

const successNotificationToggle = inject('successNotificationToggle')
const isLoading = ref(false)
const alertStore = useAlertStore()
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

const deleteDepartment = async (departmentId) => {
  if (await universityStore.deleteDepartment(departmentId)) {
    successNotificationToggle('İşlem Başarılı', 'Fakülte Silindi!')
    faculty.value.departments = []
    faculty.value.departments = await universityStore.fetchUniversityFacultyDepartments(
        faculty.value.university_id,
        facultyId
      )
  } else {
    errorNotificationToggle('HATA', 'Bölüm Silinemedi!')
  }
}

const deleteDepartmentWithModal = (departmentId) => {
  alertStore.setDeleteModalPreview(true)
  alertStore.setDeleteModalAction(() => deleteDepartment(departmentId))
}

const onSubmit = async () => {
  isLoading.value = true

  if (await universityStore.updateUniversityFaculty(facultyId, faculty.value)) {
    isLoading.value = false
    successNotificationToggle('İşlem Başarılı', 'Fakülte Bilgileri Güncellendi.')
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
      <h2 class="mr-auto text-lg font-medium">Fakülte Bilgilerini Düzenle</h2>
      <div class="flex w-full mt-4 sm:w-auto sm:mt-0">
        <RouterLink :to="{
          name: 'departments.create',
          query: { universityId: faculty.university_id, facultyId: faculty.id }
        }">
          <Button variant="primary" class="mr-2 shadow-md">
            Yeni Bölüm Ekle
          </Button>
        </RouterLink>
      </div>
    </div>
    <div class="grid grid-cols-12 gap-6 mt-5">
      <div class="col-span-12 intro-y lg:col-span-5">
        <div class="intro-y box">
          <div class="flex flex-col items-center p-5 border-b sm:flex-row border-slate-200/60 dark:border-darkmode-400">
            <h2 class="mr-auto text-base font-medium">Fakülte Bilgileri</h2>
          </div>
          <div class="p-5">
            <form class="validate-form" @submit.prevent="onSubmit">
              <div class="input-form" v-if="universities.length > 0 && faculty.university_id">
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
      <div class="col-span-12 intro-y lg:col-span-7">
        <div class="intro-y box">
          <div class="flex flex-col items-center p-5 border-b sm:flex-row border-slate-200/60 dark:border-darkmode-400">
            <h2 class="mr-auto text-base font-medium">Bölümler</h2>
          </div>
          <div class="p-5">
            <div v-if="faculty.departments && faculty.departments.length > 0" class="col-span-12 overflow-auto intro-y lg:overflow-visible">
              <Table class="border-spacing-y-[10px] border-separate -mt-2">
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th class="border-b-0 whitespace-nowrap"> ID </Table.Th>
                    <Table.Th class="border-b-0 whitespace-nowrap"> Adı </Table.Th>
                    <Table.Th class="border-b-0 whitespace-nowrap"> İşlemler </Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  <Table.Tr v-for="(department, key) in faculty.departments" :key="key" class="intro-x">
                    <Table.Td
                      class="first:rounded-l-md last:rounded-r-md w-10 bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]"
                    >
                      {{ department.id }}
                    </Table.Td>
                    <Table.Td
                      class="first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]"
                    >
                      {{ department.name }}
                    </Table.Td>
                    <Table.Td
                      class="first:rounded-l-md last:rounded-r-md w-40 bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b] py-0 relative before:block before:w-px before:h-8 before:bg-slate-200 before:absolute before:left-0 before:inset-y-0 before:my-auto before:dark:bg-darkmode-400"
                    >
                      <div class="flex items-center justify-center">
                        <span
                          class="flex items-center mr-3 w-20 cursor-pointer"
                          @click="() => router.push({ name: 'departments.edit', params: { departmentId: department.id } })"
                        >
                          <Lucide icon="CheckSquare" class="w-4 h-4 mr-1" /> Düzenle
                        </span>
                        <span
                          class="flex items-center text-danger cursor-pointer"
                          @click="() => deleteDepartmentWithModal(department.id)"
                        >
                          <Lucide icon="Trash2" class="w-4 h-4 mr-1" /> Sil
                        </span>
                      </div>
                    </Table.Td>
                  </Table.Tr>
                </Table.Tbody>
              </Table>
            </div>
            <div v-else>
              Henüz Bölüm Oluşturulmamış
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
