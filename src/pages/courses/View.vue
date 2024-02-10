<script setup lang="ts">
import Button from "@/base-components/Button"
import LoadingIcon from '@/base-components/LoadingIcon'
import TippyContent from '@/base-components/TippyContent'
import Lucide from '@/base-components/Lucide'
import { computed, ref, onBeforeMount, inject } from "vue"
import { useRouter, useRoute } from "vue-router"
import UsersTable from '@/pages/users/Index.vue'
import WhatsappGroupsTable from '@/pages/whatsappGroups/Index.vue'
import CourseTeacherStudentsMatchingsTable from '@/pages/teacherStudents/MatchingsIndex.vue'
import useClipboard from 'vue-clipboard3'
import { useUserStore } from "@/stores/user"
import { useCourseStore } from "@/stores/course"
import _ from "lodash";
import moment from 'moment';

const successNotificationToggle = inject('successNotificationToggle')
const warningNotificationToggle = inject('warningNotificationToggle')
const isLoading = ref(false)
const { toClipboard } = useClipboard()
const router = useRouter()
const route = useRoute()
const courseId = route.params.courseId
const user = useUserStore()
const courseStore = useCourseStore()
const course = ref({})
const statusText = ref('')
const applicationTimeExpired = ref(false)
const matchingsHasStarted = ref(false)

onBeforeMount(async () => {
  course.value = await courseStore.fetchCourse(courseId)
  course.value.start_at = moment(course.value.start_at, "DD-MM-YYYY hh:mm").format('YYYY-MM-DD HH:mm')
  const lastApplicationTime = moment(course.value.can_be_applied_until, "DD-MM-YYYY hh:mm")
  course.value.can_be_applied_until = lastApplicationTime.format('YYYY-MM-DD HH:mm')

  if (course.value.can_be_applied) {
    if (moment(lastApplicationTime, "DD-MM-YYYY hh:mm").diff(moment(), 'minutes') < 0) {
      applicationTimeExpired.value = true
      statusText.value = 'Başvuru Süresi Dolmuş'
      course.value.can_be_applied = false
    } else {
      statusText.value = 'Başvuru Açık'
    }
  } else {
    statusText.value = 'Başvuru Kapalı'
  }

  if (course.value.students_matchings_started_at &&
    moment().diff(moment(course.value.students_matchings_started_at, "DD-MM-YYYY hh:mm"), 'minutes') < 15
  ) {
    matchingsHasStarted.value = true
  }

  if (course.value.proficiency_exam_start_time) {
    course.value.proficiency_exam_start_time = moment(course.value.proficiency_exam_start_time, "DD-MM-YYYY hh:mm").format('YYYY-MM-DD HH:mm')
  }
})

const canOrganizeWhatsappGroups = computed(() => {
  return course.value.whatsapp_groups_count > 0 &&
    course.value.total_users_count !== course.value.whatsapp_groups_users_count &&
    (!course.value.can_be_applied || applicationTimeExpired.value) &&
    (
      course.value.type !== 'whatshafiz' ||
      (course.value.unmatched_users_count === 0 && course.value.total_users_count === course.value.matched_users_count)
    )
})

const copyToClipboard = async (data, message = 'Kopyalandı.') => {
  toClipboard(data)
  successNotificationToggle(message, data)
}

const startMatchings = async () => {
  if (!applicationTimeExpired.value && !confirm('Başvuru süresi henüz dolmamış! Devam etmek istiyor musunuz?')) {
    return
  }

  isLoading.value = true

  if (await courseStore.startCourseStudentsMatchings(course.value.id)) {
    isLoading.value = false
    successNotificationToggle('İşlem Başarılı', 'Eşleştirmeler başlatıldı, sayfayı yenileyerek durumu takip edebilirsiniz.')
    matchingsHasStarted.value = true
  } else {
    isLoading.value = false
    warningNotificationToggle('Bir hata oluştu', 'Eşleştirmeler başlatılırken bir hata oluştu, lütfen teknik ekibe bildirin.')
    window.scrollTo(0, 0)
  }
}

const organizeWhatsappGroups = async () => {
    isLoading.value = true

  if (await courseStore.startWhatsappGroupsOrganization(course.value.id)) {
    isLoading.value = false
    successNotificationToggle('İşlem Başarılı', 'Grupların organizasyonu başlatıldı, sayfayı yenileyerek durumu takip edebilirsiniz.')
    matchingsHasStarted.value = true
  } else {
    isLoading.value = false
    warningNotificationToggle('Bir hata oluştu', 'İşlem başlatılırken bir hata oluştu, lütfen teknik ekibe bildirin.')
    window.scrollTo(0, 0)
  }
}

</script>

<template>
  <div v-if="user.can('courses.view') && course.id">
    <div class="flex flex-col items-center mt-8 intro-y sm:flex-row">
      <h2 class="mr-auto text-lg font-medium">Kurs Bilgileri</h2>
      <div v-if="user.can('courses.update')" class="flex w-full mt-4 sm:w-auto sm:mt-0">
        <RouterLink :to="{ name: 'courses.edit', params: { courseId: course.id } }">
          <Button variant="primary" class="mr-2 shadow-md">
            Bilgileri Düzenle
          </Button>
        </RouterLink>
      </div>
    </div>
    <div class="mt-5 intro-y">
      <div class="grid grid-cols-12 box">
        <div class="flex flex-col justify-center col-span-12 px-4 py-8 lg:col-span-3">
          <div class="flex items-center justify-center text-slate-600 dark:text-slate-300 uppercase">
            {{ course.type }}
          </div>
          <div class="flex items-center justify-center">
            <div class="relative text-2xl font-medium">
              {{ course.name }}
            </div>
          </div>
          <div class="flex items-center justify-around">
            <span v-if="course.is_active" class="text-success">Aktif</span>
            <span v-else class="text-danger">Pasif</span>
            
            <span v-if="course.can_be_applied" class="text-success">{{ statusText }}</span>
            <span v-else class="text-danger">{{ statusText }}</span>
          </div>
          <div v-if="course.whatsapp_channel_join_url" class="flex items-center justify-around mt-8">
            <div>
              <div class="text-slate-500">Whatsapp Duyuru Kanalı Linki</div>
              <div class="mt-1.5 flex items-center justify-evenly">
                <a
                  class="flex items-center cursor-pointer hover:underline"
                  @click="copyToClipboard(course.whatsapp_channel_join_url, 'Kanal bağlantısı kopyalandı.')"
                >
                  <i data-lucide="copy" class="w-4 h-4 mr-1"></i> Kopyala
                </a>
                <a
                  class="flex items-center cursor-pointer hover:underline text-success"
                  target="_blank"
                  :href="course.whatsapp_channel_join_url"
                >
                  <i data-lucide="external-link" class="w-4 h-4 mr-1"></i> Katıl
                </a>
              </div>
            </div>
          </div>
        </div>
        <div
          class="col-span-12 p-8 border-t border-dashed lg:col-span-9 lg:border-t-0 lg:border-l border-slate-200 dark:border-darkmode-300">
          <div>
            <div class="px-5">
              <div class="grid grid-cols-12 gap-y-8 gap-x-10">
                <div class="col-span-6 sm:col-span-6 md:col-span-3">
                  <div class="text-slate-500">Kurs Son Başvuru Tarihi</div>
                  <div class="mt-1.5 flex items-center">
                    <div class="text-base">{{ course.can_be_applied_until }}</div>
                  </div>
                </div>
                <div v-if="course.proficiency_exam_start_time" class="col-span-12 sm:col-span-6 md:col-span-3">
                  <div class="text-slate-500">HafızOl Kabul Sınavı Başlangıç Zamanı</div>
                  <div class="mt-1.5 flex items-center">
                    <div class="text-base">{{ course.proficiency_exam_start_time }}</div>
                  </div>
                </div>
                <div class="col-span-12 sm:col-span-6 md:col-span-3">
                  <div class="text-slate-500">Kurs Başlama Tarihi</div>
                  <div class="mt-1.5 flex items-center">
                    <div class="text-base">{{ course.start_at }}</div>
                  </div>
                </div>
                <div class="col-span-12 sm:col-span-6 md:col-span-3">
                  <div class="text-slate-500">Whatsapp Grup/Kullanıcı Sayısı</div>
                  <div class="mt-1.5 flex items-center">
                    <div class="text-base">
                      {{ course.whatsapp_groups_count }} Grup / {{ course.whatsapp_groups_users_count }} Kullanıcı
                    </div>
                  </div>
                  <div class="tooltip-content">
                    <TippyContent to="custom-tooltip-content">
                      <div class="relative flex items-center py-1">
                        <div class="ml-4 mr-auto">
                          <div class="font-medium leading-relaxed dark:text-slate-200">
                            Kullanıcıları Gruplara Dağıtabilmek İçin:
                          </div>
                          <div class="text-slate-500 dark:text-slate-400">
                            <ul class="list-disc">
                              <li :class="{ 'line-through': (!course.can_be_applied || applicationTimeExpired) }">
                                  Kurs başvuru süresi dolmuş veya başvuruya kapatılmış olmalı.
                              </li>
                              <li :class="{ 'line-through': course.whatsapp_groups_count > 0 }">
                                En az 1 tane whatsapp grubu oluşturulmalı.
                              </li>
                              <li :class="{ 'line-through': course.total_users_count > course.whatsapp_groups_users_count }">
                                Whatsapp grubuna atanmamış öğrenci bulunmalı.
                              </li>
                              <li v-if="course.type === 'whatshafiz'"
                                :class="{ 'line-through': course.unmatched_users_count > 0 }"
                              >
                                HafızOl-HafızKal eşleştirmeleri tamamlanmış olmalı.
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </TippyContent>
                  </div>
                  <div class="flex">
                    <Button variant="secondary" size="sm" class="mb-2 mr-1" data-tooltip="custom-tooltip-content">
                      <Lucide icon="Info" class="w-5 h-5" />
                    </Button>
                    <Button
                      :disabled="isLoading || matchingsHasStarted || !canOrganizeWhatsappGroups"
                      @click="organizeWhatsappGroups()"
                      variant="primary"
                      size="sm"
                      class="mb-2 mr-1"
                    >
                      <LoadingIcon v-show="isLoading" icon="oval" color="white" class="w-4 h-4 mr-5" />
                      <span v-if="matchingsHasStarted">Kullanıcılar Gruplara Dağıtılıyor</span>
                      <span v-else>Kullanıcıları Gruplara Dağıt</span>
                    </Button>
                  </div>
                </div>
                <div class="col-span-12 sm:col-span-6 md:col-span-3">
                  <div class="text-slate-500">Toplam Kullanıcı Sayısı</div>
                  <div class="mt-1.5 flex items-center">
                    <div class="text-base">{{ course.total_users_count }}</div>
                  </div>
                </div>
                <template v-if="course.type === 'whatshafiz'">
                  <div class="col-span-12 sm:col-span-6 md:col-span-3">
                    <div class="text-slate-500">HafızKal Başvuru Sayısı</div>
                    <div class="mt-1.5 flex items-center">
                      <div class="text-base">{{ course.hafizkal_users_count }}</div>
                    </div>
                  </div>
                  <div class="col-span-12 sm:col-span-6 md:col-span-3">
                    <div class="text-slate-500">HafızOl Başvuru Sayısı</div>
                    <div class="mt-1.5 flex items-center">
                      <div class="text-base">{{ course.hafizol_users_count }}</div>
                    </div>
                  </div>
                  <div class="col-span-12 sm:col-span-6 md:col-span-3">
                    <div class="text-slate-500">Eşleştirilen HafızKal Sayısı</div>
                    <div class="mt-1.5 flex items-center">
                      <div class="text-base">{{ course.matched_hafizkal_users_count }}</div>
                    </div>
                  </div>
                  <div class="col-span-12 sm:col-span-6 md:col-span-3">
                    <div class="text-slate-500">Eşleştirilen HafızOl Sayısı</div>
                    <div class="mt-1.5 flex items-center">
                      <div class="text-base">{{ course.matched_hafizol_users_count }}</div>
                    </div>
                  </div>
                  <div class="col-span-12 sm:col-span-6 md:col-span-3">
                    <div class="text-slate-500">Toplam Eşleştirilen Kullanıcı Sayısı</div>
                    <div class="mt-1.5 flex items-center">
                      <div class="text-base">{{ course.matched_users_count }}</div>
                    </div>
                  </div>
                  <div class="col-span-12 sm:col-span-6 md:col-span-3">
                    <div class="text-slate-500">Eşleştirme Bekleyen Kullanıcı Sayısı</div>
                    <div class="mt-1.5 flex items-center">
                      <div class="text-base" v-if="course.unmatched_users_count > 0 && matchingsHasStarted">
                        Eşleştiriliyor...
                      </div>
                      <div class="text-base" v-else>{{ course.unmatched_users_count }}</div>
                    </div>
                    <Button
                      v-if="course.unmatched_users_count > 0 && !matchingsHasStarted"
                      :disabled="isLoading"
                      @click="startMatchings()"
                      variant="primary"
                      size="sm"
                      class="mb-2 mr-1"
                    >
                      <LoadingIcon v-show="isLoading" icon="oval" color="white" class="w-4 h-4 mr-5" />
                      Eşleştirmeyi Başlat
                    </Button>
                  </div>
                  <div v-if="course.students_matchings_started_at" class="col-span-12 sm:col-span-6 md:col-span-3">
                    <div class="text-slate-500">En Son Eşleştirmenin Başladığı Zaman</div>
                    <div class="mt-1.5 flex items-center">
                      <div class="text-base">{{ course.students_matchings_started_at }}</div>
                    </div>
                  </div>
                  <div v-if="course.whatsapp_groups_users_count > 0" class="col-span-12 sm:col-span-6 md:col-span-3">
                    <div class="text-slate-500">WhatsappGruplarındaki Kullanıcı Sayısı</div>
                    <div class="mt-1.5 flex items-center">
                      <div class="text-base">{{ course.whatsapp_groups_users_count }}</div>
                    </div>
                  </div>
                </template>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <course-teacher-students-matchings-table
    v-if="course.id && course.matched_users_count > 0"
    :course-id="course.id"
    :course-name="course.name"
  />
  <users-table v-if="course.id" :course-id="course.id" :course-name="course.name" />
  <whatsapp-groups-table v-if="course.id" :course-id="course.id" :course-name="course.name" />
</template>
