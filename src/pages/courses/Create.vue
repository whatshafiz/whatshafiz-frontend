<script setup lang="ts">
import { FormLabel, FormInput } from "@/base-components/Form"
import Button from "@/base-components/Button"
import Lucide from "@/base-components/Lucide"
import LoadingIcon from '@/base-components/LoadingIcon'
import TomSelect from '@/base-components/TomSelect'
import FormSwitch from '@/base-components/Form/FormSwitch'
import { ref, reactive, inject, onBeforeMount } from "vue"
import { useRouter } from "vue-router"
import { useUserStore } from "@/stores/user"
import { useCourseStore } from "@/stores/course"
import { useCourseTypeStore } from "@/stores/courseType"
import _ from "lodash";

const successNotificationToggle = inject('successNotificationToggle')
const isLoading = ref(false)
const router = useRouter()
const user = useUserStore()
const courseTypeStore = useCourseTypeStore()
const courseTypes = ref([])
const courseStore = useCourseStore()
const course = reactive({
  'type': '',
  'name': '',
  'is_active': 0,
  'can_be_applied': 0,
  'can_be_applied_until': '',
  'proficiency_exam_start_time': '',
  'start_at': '',
})

onBeforeMount(async () => {
  courseTypes.value = (await courseTypeStore.fetchCourseTypes()).filter(courseType => courseType.parent_id !== null)
})

const onSubmit = async () => {
  isLoading.value = true

  if (await courseStore.createCourse(course)) {
    isLoading.value = false
    successNotificationToggle('İşlem Başarılı', 'Yeni Kurs Oluşturuldu.')
    router.push({ name: 'courses.index' })
  } else {
    isLoading.value = false
    window.scrollTo(0, 0)
  }
}
</script>

<template>
  <div v-if="user.can('courses.create')">
    <div class="flex items-center mt-8 intro-y">
      <h2 class="mr-auto text-lg font-medium">Yeni Kurs Oluştur</h2>
    </div>
    <div class="grid grid-cols-12 gap-6 mt-5">
      <div class="col-span-12 intro-y lg:col-span-6">
        <div class="intro-y box">
          <div class="flex flex-col items-center p-5 border-b sm:flex-row border-slate-200/60 dark:border-darkmode-400">
            <h2 class="mr-auto text-base font-medium">Kurs Bilgileri</h2>
          </div>
          <div class="p-5">
            <form
              class="validate-form"
              @submit.prevent="onSubmit"
            >
              <div class="input-form">
                <FormLabel
                  htmlFor="name"
                  class="flex flex-col w-full sm:flex-row"
                >
                  Kurs Türü
                  <span class="mt-1 text-xs sm:ml-auto sm:mt-0 text-slate-500">
                    Zorunlu
                  </span>
                </FormLabel>
                <TomSelect
                  v-model="course.course_type_id"
                  :options="{ placeholder: 'Kurs türünü seçin.' }"
                  class="w-full"
                >
                  <option
                    v-for="(courseType, key) in courseTypes"
                    :key="key"
                    :value="courseType.id"
                  >
                    {{ courseType.name }}
                  </option>
                </TomSelect>
              </div>
              <div class="input-form mt-4">
                <FormLabel
                  htmlFor="name"
                  class="flex flex-col w-full sm:flex-row"
                >
                  Kurs Adı
                  <span class="mt-1 text-xs sm:ml-auto sm:mt-0 text-slate-500">
                    Zorunlu
                  </span>
                </FormLabel>
                <FormInput
                  id="name"
                  v-model="course.name"
                  :value="course.name"
                  type="text"
                  name="name"
                  required
                  placeholder="Kurs Adını Yazın"
                />
              </div>
              <div class="input-form mt-4">
                <FormLabel
                  htmlFor="name"
                  class="flex flex-col w-full sm:flex-row"
                >
                  Whatsapp Duyuru Kanalı Katılma Linki
                </FormLabel>
                <FormInput
                  id="join_url"
                  v-model="course.whatsapp_channel_join_url"
                  :value="course.whatsapp_channel_join_url"
                  type="text"
                  name="join_url"
                  placeholder="Kanal katılma linkini buraya yapıştırın."
                />
              </div>
              <div class="input-form mt-4">
                <FormLabel
                  htmlFor="name"
                  class="flex flex-col w-full sm:flex-row"
                >
                  Son Başvuru Tarihi
                </FormLabel>
                <div class="relative w-90">
                  <div
                    class="absolute flex items-center justify-center w-10 h-full border rounded-l bg-slate-100 text-slate-500 dark:bg-darkmode-700 dark:border-darkmode-800 dark:text-slate-400"
                  >
                    <Lucide
                      icon="Calendar"
                      class="w-4 h-4"
                    />
                  </div>
                  <FormInput
                    id="can_be_applied_until"
                    v-model="course.can_be_applied_until"
                    :value="course.can_be_applied_until"
                    type="datetime-local"
                    name="can_be_applied_until"
                    required
                    class="pl-12"
                    min="2023-01-01T00:00"
                    max="2040-01-01T00:00"
                  />
                </div>
              </div>
              <div
                v-if="course.type === 'whatshafiz'"
                class="input-form mt-4"
              >
                <FormLabel
                  htmlFor="name"
                  class="flex flex-col w-full sm:flex-row"
                >
                  HafızOl Kabul Sınavı Başlama Zamanı
                </FormLabel>
                <div class="relative w-90">
                  <div
                    class="absolute flex items-center justify-center w-10 h-full border rounded-l bg-slate-100 text-slate-500 dark:bg-darkmode-700 dark:border-darkmode-800 dark:text-slate-400"
                  >
                    <Lucide
                      icon="Calendar"
                      class="w-4 h-4"
                    />
                  </div>
                  <FormInput
                    id="proficiency_exam_start_time"
                    v-model="course.proficiency_exam_start_time"
                    :value="course.proficiency_exam_start_time"
                    type="datetime-local"
                    name="proficiency_exam_start_time"
                    required
                    class="pl-12"
                    min="2023-01-01T00:00"
                    max="2040-01-01T00:00"
                  />
                </div>
              </div>
              <div class="input-form mt-4">
                <FormLabel
                  htmlFor="name"
                  class="flex flex-col w-full sm:flex-row"
                >
                  Kurs Başlama Tarihi
                </FormLabel>
                <div class="relative w-90">
                  <div
                    class="absolute flex items-center justify-center w-10 h-full border rounded-l bg-slate-100 text-slate-500 dark:bg-darkmode-700 dark:border-darkmode-800 dark:text-slate-400"
                  >
                    <Lucide
                      icon="Calendar"
                      class="w-4 h-4"
                    />
                  </div>
                  <FormInput
                    id="start_at"
                    v-model="course.start_at"
                    :value="course.start_at"
                    type="datetime-local"
                    name="start_at"
                    required
                    class="pl-12"
                    min="2023-01-01T00:00"
                    max="2040-01-01T00:00"
                  />
                </div>
              </div>
              <div class="mt-4">
                <label>Aktif Kurs mu?</label>
                <div class="mt-2">
                  <FormSwitch>
                    <FormSwitch.Input
                      id="is_active"
                      type="checkbox"
                      name="is_active"
                      v-model="course.is_active"
                    />
                    <FormSwitch.Label htmlFor="is_active">
                      Aktif
                    </FormSwitch.Label>
                  </FormSwitch>
                </div>
              </div>
              <div class="mt-4">
                <label>Başvuruya Açık mı?</label>
                <div class="mt-2">
                  <FormSwitch>
                    <FormSwitch.Input
                      id="can_be_applied"
                      type="checkbox"
                      name="can_be_applied"
                      v-model="course.can_be_applied"
                    />
                    <FormSwitch.Label htmlFor="can_be_applied">
                      Açık
                    </FormSwitch.Label>
                  </FormSwitch>
                </div>
              </div>
              <Button
                variant="primary"
                type="submit"
                class="w-1/2 mt-5 mr-2"
                :disabled="isLoading"
              >
                <LoadingIcon
                  v-show="isLoading"
                  icon="oval"
                  color="white"
                  class="w-4 h-4 mr-5"
                />
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
