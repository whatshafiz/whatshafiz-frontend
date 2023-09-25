<script setup lang="ts">
import { FormLabel, FormInput } from "@/base-components/Form"
import Button from "@/base-components/Button"
import Lucide from "@/base-components/Lucide"
import TomSelect from '@/base-components/TomSelect'
import FormSwitch from '@/base-components/Form/FormSwitch'
import { ref, onBeforeMount, inject } from "vue"
import { useRouter, useRoute } from "vue-router"
import UsersTable from '@/pages/users/Index.vue'
import WhatsappGroupsTable from '@/pages/whatsappGroups/Index.vue'
import { useUserStore } from "@/stores/user"
import { useCourseStore } from "@/stores/course"
import _ from "lodash";
import moment from 'moment';

const router = useRouter()
const route = useRoute()
const courseId = route.params.courseId
const user = useUserStore()
const courseStore = useCourseStore()
const course = ref({})
const statusText = ref('')

onBeforeMount(async () => {
  course.value = await courseStore.fetchCourse(courseId)
  course.value.start_at = moment(course.value.start_at, "DD-MM-YYYY hh:mm").format('YYYY-MM-DD HH:mm')
  const lastApplicationTime = moment(course.value.can_be_applied_until, "DD-MM-YYYY hh:mm")
  course.value.can_be_applied_until = lastApplicationTime.format('YYYY-MM-DD HH:mm')

  if (course.value.can_be_applied) {
    if (moment(lastApplicationTime, "DD-MM-YYYY hh:mm").diff(moment(), 'minutes') < 0) {
      statusText.value = 'Başvuru Süresi Dolmuş'
      course.value.can_be_applied = false
    } else {
      statusText.value = 'Başvuru Açık'
    }
  } else {
    statusText.value = 'Başvuru Kapalı'
  }

  if (course.value.proficiency_exam_start_time) {
    course.value.proficiency_exam_start_time = moment(course.value.proficiency_exam_start_time, "DD-MM-YYYY hh:mm").format('YYYY-MM-DD HH:mm')
  }
})
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
        <div class="flex flex-col justify-center col-span-12 px-4 py-8 lg:col-span-4">
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
        </div>
        <div
          class="col-span-12 p-8 border-t border-dashed lg:col-span-8 lg:border-t-0 lg:border-l border-slate-200 dark:border-darkmode-300">
          <div>
            <div class="px-5">
              <div class="grid grid-cols-12 gap-y-8 gap-x-10">
                <div class="col-span-6 sm:col-span-6 md:col-span-4">
                  <div class="text-slate-500">Kurs Son Başvuru Tarihi</div>
                  <div class="mt-1.5 flex items-center">
                    <div class="text-base">{{ course.can_be_applied_until }}</div>
                  </div>
                </div>
                <div v-if="course.proficiency_exam_start_time" class="col-span-12 sm:col-span-6 md:col-span-4">
                  <div class="text-slate-500">HafızOl Kabul Sınavı Başlangıç Zamanı</div>
                  <div class="mt-1.5 flex items-center">
                    <div class="text-base">{{ course.proficiency_exam_start_time }}</div>
                  </div>
                </div>
                <div class="col-span-12 sm:col-span-6 md:col-span-4">
                  <div class="text-slate-500">Kurs Başlama Tarihi</div>
                  <div class="mt-1.5 flex items-center">
                    <div class="text-base">{{ course.start_at }}</div>
                  </div>
                </div>
                <div class="col-span-12 sm:col-span-6 md:col-span-4">
                  <div class="text-slate-500">Toplam Kullanıcı Sayısı</div>
                  <div class="mt-1.5 flex items-center">
                    <div class="text-base">{{ course.total_users_count }}</div>
                  </div>
                </div>
                <div class="col-span-12 sm:col-span-6 md:col-span-4">
                  <div class="text-slate-500">Whatsapp Grup Sayısı</div>
                  <div class="mt-1.5 flex items-center">
                    <div class="text-base">{{ course.whatsapp_groups_count }}</div>
                  </div>
                </div>
                <template v-if="course.type === 'whatshafiz'">
                  <div class="col-span-12 sm:col-span-6 md:col-span-4">
                    <div class="text-slate-500">HafızKal Başvuru Sayısı</div>
                    <div class="mt-1.5 flex items-center">
                      <div class="text-base">{{ course.hafizkal_users_count }}</div>
                    </div>
                  </div>
                  <div class="col-span-12 sm:col-span-6 md:col-span-4">
                    <div class="text-slate-500">HafızOl Başvuru Sayısı</div>
                    <div class="mt-1.5 flex items-center">
                      <div class="text-base">{{ course.hafizol_users_count }}</div>
                    </div>
                  </div>
                  <div class="col-span-12 sm:col-span-6 md:col-span-4">
                    <div class="text-slate-500">Eşleştirilen HafızKal Sayısı</div>
                    <div class="mt-1.5 flex items-center">
                      <div class="text-base">{{ course.matched_hafizkal_users_count }}</div>
                    </div>
                  </div>
                  <div class="col-span-12 sm:col-span-6 md:col-span-4">
                    <div class="text-slate-500">Eşleştirilen HafızOl Sayısı</div>
                    <div class="mt-1.5 flex items-center">
                      <div class="text-base">{{ course.matched_hafizol_users_count }}</div>
                    </div>
                  </div>
                  <div class="col-span-12 sm:col-span-6 md:col-span-4">
                    <div class="text-slate-500">Toplam Eşleştirilen Sayısı</div>
                    <div class="mt-1.5 flex items-center">
                      <div class="text-base">{{ course.matched_users_count }}</div>
                    </div>
                  </div>
                  <div class="col-span-12 sm:col-span-6 md:col-span-4">
                    <div class="text-slate-500">Eşleştirme Bekleyen Kullanıcı Sayısı</div>
                    <div class="mt-1.5 flex items-center">
                      <div class="text-base">{{ course.unmatched_users_count }}</div>
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
  <users-table v-if="course.id" :course-id="course.id" :course-name="course.name" />
  <whatsapp-groups-table v-if="course.id" :course-id="course.id" :course-name="course.name"/>
</template>
