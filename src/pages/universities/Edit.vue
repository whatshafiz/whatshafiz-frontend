<script setup lang="ts">
import { FormLabel, FormInput } from "@/base-components/Form"
import Button from "@/base-components/Button"
import LoadingIcon from '@/base-components/LoadingIcon'
import Table from '@/base-components/Table'
import Lucide from '@/base-components/Lucide'
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
const user = useUserStore()
const universityStore = useUniversityStore()
const university = ref({})
const universityId = route.params.universityId

onBeforeMount(async () => {
  university.value = await universityStore.fetchUniversity(universityId)
})

const deleteFaculty = async (facultyId) => {
  if (await universityStore.deleteFaculty(facultyId)) {
    successNotificationToggle('İşlem Başarılı', 'Fakülte Silindi!')
    university.value.faculties = []
    university.value.faculties = await universityStore.fetchUniversityFaculties(universityId)
  } else {
    errorNotificationToggle('HATA', 'Fakülte Silinemedi!')
  }
}

const deleteFacultyWithModal = (facultyId) => {
  alertStore.setDeleteModalPreview(true)
  alertStore.setDeleteModalAction(() => deleteFaculty(facultyId))
}

const onSubmit = async () => {
  isLoading.value = true

  if (await universityStore.updateUniversity(university.value.id, university.value.name)) {
    isLoading.value = false
    successNotificationToggle('İşlem Başarılı', 'Üniversite Bilgileri Güncellendi.')
    router.push({ name: 'universities.index' })
  } else {
    isLoading.value = false
    window.scrollTo(0, 0)
  }
}
</script>

<template>
  <div v-if="user.can('universities.update')">
    <div class="flex items-center mt-8 intro-y">
      <h2 class="mr-auto text-lg font-medium">Üniversite Düzenleme</h2>
      <div class="flex w-full mt-4 sm:w-auto sm:mt-0" v-if="universityId">
        <RouterLink :to="{ name: 'faculties.create', query: { universityId: universityId }}">
          <Button variant="primary" class="mr-2 shadow-md">
            Yeni Fakülte Ekle
          </Button>
        </RouterLink>
      </div>
    </div>
    <div class="grid grid-cols-12 gap-6 mt-5">
      <div class="col-span-12 intro-y lg:col-span-5">
        <div class="intro-y box">
          <div class="flex flex-col items-center p-5 border-b sm:flex-row border-slate-200/60 dark:border-darkmode-400">
            <h2 class="mr-auto text-base font-medium">Üniversite Bilgileri</h2>
          </div>
          <div class="p-5">
            <form class="validate-form" @submit.prevent="onSubmit">
              <div class="input-form mt-4">
                <FormLabel htmlFor="name" class="flex flex-col w-full sm:flex-row">
                  Üniversite Adı
                  <span class="mt-1 text-xs sm:ml-auto sm:mt-0 text-slate-500">
                    Zorunlu
                  </span>
                </FormLabel>
                <FormInput id="name" v-model="university.name" :value="university.name" type="text" name="name" required
                  placeholder="Üniversite Adını Yazın" />
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
            <h2 class="mr-auto text-base font-medium">Fakülteler</h2>
          </div>
          <div class="p-5">
            <div v-if="university.faculties && university.faculties.length > 0" class="col-span-12 overflow-auto intro-y lg:overflow-visible">
              <Table class="border-spacing-y-[10px] border-separate -mt-2">
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th class="border-b-0 whitespace-nowrap"> ID </Table.Th>
                    <Table.Th class="border-b-0 whitespace-nowrap"> Adı </Table.Th>
                    <Table.Th class="border-b-0 whitespace-nowrap"> İşlemler </Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  <Table.Tr v-for="(faculty, key) in university.faculties" :key="key" class="intro-x">
                    <Table.Td
                      class="first:rounded-l-md last:rounded-r-md w-10 bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]"
                    >
                      {{ faculty.id }}
                    </Table.Td>
                    <Table.Td
                      class="first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]"
                    >
                      {{ faculty.name }}
                    </Table.Td>
                    <Table.Td
                      class="first:rounded-l-md last:rounded-r-md w-40 bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b] py-0 relative before:block before:w-px before:h-8 before:bg-slate-200 before:absolute before:left-0 before:inset-y-0 before:my-auto before:dark:bg-darkmode-400"
                    >
                      <div class="flex items-center justify-center">
                        <span
                          class="flex items-center mr-3 w-20 cursor-pointer"
                          @click="() => router.push({ name: 'faculties.edit', params: { facultyId: faculty.id } })"
                        >
                          <Lucide icon="CheckSquare" class="w-4 h-4 mr-1" /> Düzenle
                        </span>
                        <span
                          class="flex items-center text-danger cursor-pointer"
                          @click="() => deleteFacultyWithModal(faculty.id)"
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
              Henüz Fakülte Oluşturulmamış
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
