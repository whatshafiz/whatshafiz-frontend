<script setup lang="ts">
import { FormLabel, FormInput } from "@/base-components/Form"
import Button from "@/base-components/Button"
import Alert from "@/base-components/Alert"
import Lucide from "@/base-components/Lucide"
import LoadingIcon from '@/base-components/LoadingIcon'
import TomSelect from '@/base-components/TomSelect'
import FormSwitch from '@/base-components/Form/FormSwitch'
import { ref, onBeforeMount, inject } from "vue"
import { useRouter, useRoute } from "vue-router"
import useClipboard from 'vue-clipboard3'
import { useUserStore } from "@/stores/user"
import { useCourseStore } from "@/stores/course"
import { useRegulationStore } from "@/stores/regulation"
import _ from "lodash";
import { useAlertStore } from "@/stores/alert"

const successNotificationToggle = inject('successNotificationToggle')
const alertStore = useAlertStore()
const isLoading = ref(false)
const whatsappGroupJoinUrl = ref('')
const { toClipboard } = useClipboard()
const router = useRouter()
const route = useRoute()
const courseType = route.params.courseType
const courseId = ref(null)
const user = useUserStore()
const courseStore = useCourseStore()
const regulationStore = useRegulationStore()
const course = ref({})
const regulation = ref({})

onBeforeMount(async () => {
  course.value = (await courseStore.hasAvailableCourse(courseType))

  if (!course.value) {
    alertStore.addErrorMessage('Başvuruya açık kurs bulunamadı!')
    localStorage.removeItem('newCourseRegisterType')

    return
  }

  regulation.value = await regulationStore.fetchRegulation(courseType)
})

const copyToClipboard = async (whatsappGroupJoinUrl) => {
  toClipboard(whatsappGroupJoinUrl)
  successNotificationToggle('Grup linki kopyalandı.', whatsappGroupJoinUrl)
}

const registerUserToCourse = async () => {
  isLoading.value = true
  localStorage.removeItem('newCourseRegisterType')
  let registrationData = {}

  if (['hafizol', 'hafizkal'].includes(courseType)) {
    registrationData = {
      type: 'whatshafiz',
      is_teacher: courseType === 'hafizkal'
    }
  } else {
    registrationData = {
      type: courseType,
      is_teacher: false
    }
  }

  const response = await courseStore.registerUserToCourse(registrationData)

  if (response.status <= 200 && response.status < 400) {
    isLoading.value = false
    successNotificationToggle('İşlem Başarılı', 'Kursa kaydınız tamamlanmıştır.')
    alertStore.addSuccessMessage(response.data.message)

    if (response.data.new_whatsapp_group_join_url) {
      whatsappGroupJoinUrl.value = response.data.new_whatsapp_group_join_url
    }

    course.value.id = null
    window.scrollTo(0, 0)
  } else {
    alertStore.addErrorMessage(response.data.message)

    isLoading.value = false
    window.scrollTo(0, 0)
  }
}

const cancelRegisterRequest = () => {
  localStorage.removeItem('newCourseRegisterType')
  router.push({ name: 'dashboard' })
}
</script>

<template>
  <div v-if="whatsappGroupJoinUrl" class="grid grid-cols-12 gap-6 mt-5">
    <div class="col-span-12 intro-y lg:col-span-12">
      <div class="intro-y box">
        <div class="p-5">
          <Alert variant="secondary" class="mb-2">
            <div class="flex items-center">
              <div class="text-lg font-medium">
                Whatsapp Grubu Katılma Linki
              </div>
            </div>
            <div class="mt-3">
              <code class="block overflow-scroll bg-white p-2 rounded">
                http://localpanel.whatshafiz.com:5173/courses/whatsenglish/register
              </code>
            </div>
          </Alert>

          <Button variant="secondary" class="w-full mb-2 mr-1" @click="copyToClipboard(whatsappGroupJoinUrl)">
            <Lucide icon="Copy" class="w-4 h-4 ml-3 mr-1 text-slate-500" /> Kopyala
          </Button>
          <a class="" target="_blank" href="whatsappGroupJoinUrl">
            <Button variant="secondary" class="w-full mb-2 mr-1">
              <Lucide icon="ExternalLink" class="w-4 h-4 ml-3 mr-1 text-slate-500" /> Linki Aç
            </Button>
          </a>
        </div>
      </div>
    </div>
  </div>
  <div v-if="course.id">
    <div class="flex items-center mt-8 intro-y">
      <h2 class="mr-auto text-lg font-medium">Kullanıcı Kurs Kaydı</h2>
    </div>
    <div class="grid grid-cols-12 gap-6 mt-5">
      <div class="col-span-12 intro-y lg:col-span-12">
        <div class="intro-y box">
          <div class="flex flex-col items-center p-5 border-b sm:flex-row border-slate-200/60 dark:border-darkmode-400">
            <h2 class="mr-auto text-base font-medium">Kurs Bilgileri</h2>
          </div>
          <div class="p-5">
            <div class="flex items-center">
              <Lucide icon="CalendarDays" class="w-4 h-4 mr-2 text-slate-500" />
              Kurs Adı:&nbsp;&nbsp; <strong> {{ course.name }}</strong>
            </div>
            <div class="flex items-center mt-3">
              <Lucide icon="CalendarOff" class="w-4 h-4 mr-2 text-slate-500" />
              Kurs Son Başvuru Tarihi:&nbsp;&nbsp; <strong> {{ course.can_be_applied_until }}</strong>
            </div>
            <div class="flex items-center mt-3">
              <Lucide icon="CalendarClock" class="w-4 h-4 mr-2 text-slate-500" />
              Kurs Başlama Tarihi:&nbsp;&nbsp; <strong> {{ course.start_at }}</strong>
            </div>
          </div>

          <div class="flex flex-col items-center p-5 border-b sm:flex-row border-slate-200/60 dark:border-darkmode-400">
            <h2 class="mr-auto text-base font-medium">Kurs Yönetmelik Özeti</h2>
          </div>

          <div class="p-5" v-html="regulation.summary"></div>

          <div class="flex flex-col items-center p-5 border-b sm:flex-row border-slate-200/60 dark:border-darkmode-400">
            <h2 class="mr-auto text-base font-medium">Kurs Yönetmeliği</h2>
          </div>

          <div class="p-5" v-html="regulation.text"></div>

          <div
            class="p-5 border-t border-slate-200/60 dark:border-darkmode-400"
          >
            <Button
              @click.native="registerUserToCourse()"
              variant="primary"
              type="button"
              class="mt-5 p-3 w-full md:w-full lg:w-6/12"
              :disabled="isLoading"
            >
              <LoadingIcon v-show="isLoading" icon="oval" color="white" class="w-4 h-4 mr-5" />
              Yönetmeliği Okudum, Onaylıyorum, Üyeliğimi Kaydet
            </Button>
            <Button
              @click.native="cancelRegisterRequest()"
              variant="outline-primary"
              type="button"
              class="mt-5 p-3 lg:ml-5 w-full md:w-full lg:w-5/12"
            >
              Vazgeç
            </Button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
