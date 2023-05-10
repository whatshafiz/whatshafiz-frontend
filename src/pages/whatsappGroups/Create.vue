<script setup lang="ts">
import { FormLabel, FormInput } from "@/base-components/Form"
import Button from "@/base-components/Button"
import LoadingIcon from '@/base-components/LoadingIcon'
import TomSelect from '@/base-components/TomSelect'
import FormSwitch from '@/base-components/Form/FormSwitch'
import { ref, reactive, onBeforeMount, inject, watch } from "vue"
import { useRouter } from "vue-router"
import { useUserStore } from "@/stores/user"
import { useCourseStore } from "@/stores/course"
import { useWhatsappGroupStore } from "@/stores/whatsappGroup"
import _ from "lodash";

const successNotificationToggle = inject('successNotificationToggle')
const isLoading = ref(false)
const router = useRouter()
const user = useUserStore()
const courseStore = useCourseStore()
const whatsappGroupStore = useWhatsappGroupStore()
const courses = ref([])
const whatsappGroup = reactive({
  'course_id': '',
  'type': '',
  'gender': '',
  'name': '',
  'is_active': 1,
  'join_url': '',
})

onBeforeMount(async () => {
  courses.value = await courseStore.fetchCourses()
})

watch(() => whatsappGroup.course_id, (newValue) => {
  const selectedCourse = courses.value.find(c => c.id == whatsappGroup.course_id)

  whatsappGroup.type = selectedCourse.type
});

const onSubmit = async () => {
  isLoading.value = true

  if (await whatsappGroupStore.createWhatsappGroup(whatsappGroup)) {
    isLoading.value = false
    successNotificationToggle('İşlem Başarılı', whatsappGroup.name + ' Oluşturuldu.')
    whatsappGroup.join_url = ''
  } else {
    isLoading.value = false
    window.scrollTo(0, 0)
  }
}
</script>

<template>
  <div v-if="user.can('whatsappGroups.create')">
    <div class="flex items-center mt-8 intro-y">
      <h2 class="mr-auto text-lg font-medium">Yeni Whatsapp Grubu Oluştur</h2>
    </div>
    <div class="grid grid-cols-12 gap-6 mt-5">
      <div class="col-span-12 intro-y lg:col-span-6">
        <div class="intro-y box">
          <div class="flex flex-col items-center p-5 border-b sm:flex-row border-slate-200/60 dark:border-darkmode-400">
            <h2 class="mr-auto text-base font-medium">Whatsapp Grup Bilgileri</h2>
          </div>
          <div class="p-5">
            <form class="validate-form" @submit.prevent="onSubmit">
              <div class="input-form" v-if="courses.length > 0">
                <FormLabel htmlFor="name" class="flex flex-col w-full sm:flex-row">
                  Kurs
                  <span class="mt-1 text-xs sm:ml-auto sm:mt-0 text-slate-500">
                    Zorunlu
                  </span>
                </FormLabel>
                <TomSelect v-model="whatsappGroup.course_id" :options="{ placeholder: 'Kurs seçin.' }" class="w-full">
                  <option v-for="course in courses" :key="course.id" :value="course.id">
                    {{ course.name }}
                  </option>
                </TomSelect>
              </div>
              <div class="input-form mt-4" v-if="courses.length > 0">
                <FormLabel htmlFor="name" class="flex flex-col w-full sm:flex-row">
                  Eğitim Türü
                  <span class="mt-1 text-xs sm:ml-auto sm:mt-0 text-slate-500">
                    Zorunlu
                  </span>
                </FormLabel>
                <TomSelect v-model="whatsappGroup.type" :options="{ placeholder: 'Eğitim türü seçin.' }" disabled
                  class="w-full">
                  <option key="whatshafiz" value="whatshafiz"> WhatsHafız </option>
                  <option key="whatshafiz" value="whatsenglish"> WhatsEnglish </option>
                  <option key="whatshafiz" value="whatsarapp"> WhatsArapp </option>
                </TomSelect>
              </div>
              <div class="input-form mt-4" v-if="courses.length > 0">
                <FormLabel htmlFor="name" class="flex flex-col w-full sm:flex-row">
                  Cinsiyet
                  <span class="mt-1 text-xs sm:ml-auto sm:mt-0 text-slate-500">
                    Zorunlu
                  </span>
                </FormLabel>
                <TomSelect v-model="whatsappGroup.gender" :options="{ placeholder: 'Cinsiyet seçin.' }" class="w-full">
                  <option key="whatshafiz" value="male"> Erkek </option>
                  <option key="whatshafiz" value="female"> Kadın </option>
                </TomSelect>
              </div>
              <div class="input-form mt-4">
                <FormLabel htmlFor="name" class="flex flex-col w-full sm:flex-row">
                  Grup Adı
                  <span class="mt-1 text-xs sm:ml-auto sm:mt-0 text-slate-500">
                    Zorunlu
                  </span>
                </FormLabel>
                <FormInput id="name" v-model="whatsappGroup.name" :value="whatsappGroup.name" type="text" name="name"
                  required placeholder="Grup Adını Yazın" />
              </div>
              <div class="input-form mt-4">
                <FormLabel htmlFor="name" class="flex flex-col w-full sm:flex-row">
                  Grup Katılma Linki
                  <span class="mt-1 text-xs sm:ml-auto sm:mt-0 text-slate-500">
                    Zorunlu
                  </span>
                </FormLabel>
                <FormInput id="join_url" v-model="whatsappGroup.join_url" :value="whatsappGroup.join_url" type="text"
                  name="join_url" required placeholder="Grup katılma linkini buraya yapıştırın." />
              </div>
              <div class="mt-3">
                <label>Aktif Grup mu?</label>
                <div class="mt-2">
                  <FormSwitch>
                    <FormSwitch.Input id="is_active" type="checkbox" name="is_active" v-model="whatsappGroup.is_active" />
                    <FormSwitch.Label htmlFor="is_active">
                      Aktif
                    </FormSwitch.Label>
                  </FormSwitch>
                </div>
              </div>
              <Button variant="primary" type="submit" class="w-1/2 mt-5 mr-2" :disabled="isLoading">
                <LoadingIcon v-show="isLoading" icon="oval" color="white" class="w-4 h-4 mr-5" />
                Kaydet ve Yeni Oluştur
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
