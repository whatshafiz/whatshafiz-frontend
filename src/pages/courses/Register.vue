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
const registerSucceeded = ref(false)
const whatsappChannelJoinUrl = ref('')
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

const copyToClipboard = async (whatsappChannelJoinUrl, message = 'Kopyalandı') => {
  toClipboard(whatsappChannelJoinUrl)
  successNotificationToggle(message, whatsappChannelJoinUrl)
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

    if (response.data.whatsapp_channel_join_url) {
      whatsappChannelJoinUrl.value = response.data.whatsapp_channel_join_url
    }

    registerSucceeded.value = true
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
  <div v-if="whatsappChannelJoinUrl" class="grid grid-cols-12 gap-6 mt-5">
    <div class="col-span-12 intro-y lg:col-span-12">
      <div class="intro-y box">
        <div class="p-5">
          <a class="" target="_blank" :href="whatsappChannelJoinUrl">
            <Button variant="primary" class="w-full mb-2 mr-1">
              <Lucide icon="ExternalLink" class="w-4 h-4 ml-3 mr-1" /> Whatsapp Duyuru Kanalına Katıl
            </Button>
          </a>
          <Button
            variant="secondary"
            class="w-full mb-2 mr-1 mt-5"
            @click="copyToClipboard(whatsappChannelJoinUrl, 'Kanal linki kopyalandı.')"
          >
            <Lucide icon="Copy" class="w-4 h-4 ml-3 mr-1 text-slate-500" /> Katılma Linkini Kopyala
          </Button>
        </div>
      </div>
    </div>
  </div>
  <div v-if="course.id">
    <div class="flex items-center mt-8 intro-y">
      <h2 class="mr-auto text-lg font-medium">Kullanıcı Kurs Kaydı</h2>
    </div>
    <Alert v-if="!registerSucceeded" variant="soft-warning" class="items-center my-4">
      <div class="flex items-center">
        <Lucide icon="AlertCircle" class="w-6 h-6 mr-2" />
        <div class="w-full">
          Kaydınızı tamamlamak için yönetmeliği <strong>dikkatlice okuyun</strong> ve <strong>onaylayın</strong>.
        </div>
      </div>
    </Alert>
    <div class="grid grid-cols-12 gap-6 mt-5">
      <div class="col-span-12 intro-y lg:col-span-12">
        <div class="intro-y box mb-10">
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
            <div v-if="course.proficiency_exam_start_time" class="flex items-center mt-3">
              <Lucide icon="CalendarCheck2" class="w-4 h-4 mr-2 text-slate-500" />
              HafızOl Kabul Sınavı Başlangıç Zamanı:&nbsp;&nbsp; <strong> {{ course.proficiency_exam_start_time }}</strong>
            </div>
            <div class="flex items-center mt-3">
              <Lucide icon="CalendarCheck" class="w-4 h-4 mr-2 text-slate-500" />
              Kurs Başlama Tarihi:&nbsp;&nbsp; <strong> {{ course.start_at }}</strong>
            </div>
          </div>
        </div>
        <div v-if="!registerSucceeded" class="intro-y box">
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
