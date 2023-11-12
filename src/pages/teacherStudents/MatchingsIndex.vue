<script setup lang="ts">
import Datatable from "@/components/Datatable";
import Button from "@/base-components/Button";
import Lucide from '@/base-components/Lucide'
import { ref, inject, onBeforeMount, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import useClipboard from 'vue-clipboard3'
import { Dialog } from '@/base-components/Headless'
import { stringToHTML } from "@/utils/helper";
import { useUserStore } from "@/stores/user";
import { useCourseStore } from "@/stores/course";
import { useAlertStore } from "@/stores/alert";

const successNotificationToggle = inject('successNotificationToggle')
const errorNotificationToggle = inject('errorNotificationToggle')

const tableRef = ref();
const { toClipboard } = useClipboard()
const alertStore = useAlertStore()
const router = useRouter()
const route = useRoute()
const user = useUserStore()
const courseStore = useCourseStore()
const teacherStudentIndexUrl = ref('')
const isMyIndex = ref(false)
const teacherStudentStatuses = ref({})
const showTeacherStudentStatusesModal = ref(false)

const props = defineProps<{
  courseId: number
  courseName: string
}>()

onBeforeMount(() => {
  teacherStudentIndexUrl.value = courseStore.getCourseTeacherStudentsIndexURL(props.courseId)
})

const copyPhoneNumber = (phoneNumber) => {
  toClipboard(phoneNumber)
  successNotificationToggle('Telefon No kopyalandı.', phoneNumber)
}

const hideTeacherStudentStatusesModal = () => {
  showTeacherStudentStatusesModal.value = false
  teacherStudentStatuses.value = {}
}

const showStudentsStatusList = async (teacherId) => {
  teacherStudentStatuses.value = await courseStore.getCourseTeacherStudentsStatuses(props.courseId, teacherId)
  showTeacherStudentStatusesModal.value = true
}

const tableColumns = [
  {
    title: "",
    formatter: "responsiveCollapse",
    width: 40,
    minWidth: 30,
    hozAlign: "center",
    resizable: false,
    headerSort: false,
  },

  // For HTML table
  {
    title: "ID",
    width: 70,
    responsive: 0,
    field: "id",
    vertAlign: "middle",
  },
  {
    title: "HafızKal Ad Soyad",
    responsive: 1,
    minWidth: 150,
    field: "teacher.name",
    vertAlign: "middle",
    headerSort: false,
    formatter(cell) {
      const response: Response = cell.getData();
      return `<div class="font-medium whitespace-nowrap">${response.teacher.name} ${response.teacher.surname}</div>`;
    },
  },
  {
    title: "HafızKal Telefon No",
    responsive: 8,
    width: 220,
    field: "teacher.phone_number",
    vertAlign: "middle",
    headerHozAlign: "center",
    headerSort: false,
    formatter(cell) {
      const rowData = cell.getData()
      const buttonsHolder = stringToHTML(`<div class="flex items-center lg:justify-center"></div>`);
      const copyButton =
        stringToHTML(`<a class="flex items-center mr-3" href="javascript:;">
                          <i data-lucide="copy" class="w-4 h-4 mr-1"></i> Kopyala
                      </a>`);
      const joinButton =
        stringToHTML(`<a class="flex items-center mr-3 text-success" target="_blank" href="https://wa.me/${rowData.teacher.phone_number}">
                          <i data-lucide="message-square" class="w-4 h-4 mr-1"></i> Mesaj Gönder
                      </a>`);

      copyButton.addEventListener("click", function (button) {
        toClipboard(rowData.teacher.phone_number)
        successNotificationToggle('Telefon No kopyalandı.', rowData.teacher.phone_number)
      });

      buttonsHolder.append(copyButton)
      buttonsHolder.append(joinButton)

      return buttonsHolder
    },
  },
  {
    title: "Toplam HafızOl Sayısı",
    responsive: 2,
    width: 200,
    field: "students_count",
    vertAlign: "middle",
  },
  {
    title: "Onaylı",
    responsive: 2,
    width: 110,
    field: "passed_students_count",
    vertAlign: "middle",
  },
  {
    title: "Red",
    responsive: 2,
    width: 110,
    field: "failed_students_count",
    vertAlign: "middle",
  },
  {
    title: "Bekleyen",
    responsive: 2,
    width: 110,
    field: "awaiting_students_count",
    vertAlign: "middle",
  },
  {
    title: "İŞLEMLER",
    width: 130,
    field: "actions",
    responsive: 20,
    hozAlign: "center",
    headerHozAlign: "center",
    vertAlign: "middle",
    headerSort: false,
    formatter(cell) {
      const rowData = cell.getData()
      const buttonsHolder = stringToHTML(`<div class="flex items-center lg:justify-center"></div>`);
      const showButton =
        stringToHTML(`<a class="flex items-center mr-3" href="javascript:;">
                                <i data-lucide="eye" class="w-4 h-4 mr-1"></i> Görüntüle
                            </a>`);
      showButton.addEventListener("click", function () {
        showStudentsStatusList(rowData.teacher_id)
      });

      buttonsHolder.append(showButton)

      return buttonsHolder
    },
  }
]
</script>

<template>
  <div v-if="user.can('course.view')">
    <div class="flex flex-col items-center mt-8 intro-y sm:flex-row">
      <h2 v-if="props.courseName" class="mr-auto text-lg font-medium">
        {{ props.courseName }} Kursundaki HafızKal-HafızOl Eşleşmeleri
      </h2>
    </div>
    <datatable ref="tableRef" :index-url="teacherStudentIndexUrl" :columns="tableColumns" />
    <Dialog :open="showTeacherStudentStatusesModal" @close="() => hideTeacherStudentStatusesModal()">
      <Dialog.Panel class="h-5/6 overflow-auto">
        <Dialog.Title>
          <h2 class="mr-auto text-base font-medium">
            HafızOl Durumları
          </h2>
        </Dialog.Title>
        <Dialog.Description class="flex">
          <template v-if="teacherStudentStatuses.length > 0">
            <div class="w-full">
              <div v-for="student in teacherStudentStatuses" class="intro-x">
                <div class="flex items-center px-5 py-3 mb-3 box drop-shadow justify-between flex-col">
                  <div class="flex w-auto">
                    <div class="ml-4 mr-auto">
                      <div class="font-medium">{{ student.student.name }} {{ student.student.surname }}</div>
                    </div>
                  </div>
                  <div class="flex mt-5 w-max">
                    <span class="flex mr-3 items-center">
                      Durumu:
                    </span>
                    <span v-if="student.proficiency_exam_passed === null" class="flex mr-3 items-center text-warning">
                      <Lucide icon="Timer" class="w-4 h-4 mr-1" /> Beklemede
                    </span>
                    <span v-if="student.proficiency_exam_passed === false" class="flex mr-3 items-center text-danger">
                      <Lucide icon="XCircle" class="w-4 h-4 mr-1" /> Red
                    </span>
                    <span v-if="student.proficiency_exam_passed === true" class="flex mr-3 items-center text-success">
                      <Lucide icon="CheckCircle" class="w-4 h-4 mr-1" /> Kabul
                    </span>
                  </div>
                  <span v-if="student.proficiency_exam_failed_description" class="flex mr-3 items-center text-slate-500 my-5">
                    {{ student.proficiency_exam_failed_description }}
                  </span>
                  <div class="flex mt-5 w-max">
                    <span class="flex mr-3 items-center">
                      Telefon No:
                    </span>
                    <a class="flex mr-3 items-center cursor-pointer" @click="copyPhoneNumber(student.student.phone_number)">
                      <Lucide icon="Copy" class="w-4 h-4 mr-1" /> Kopyala
                    </a>
                    <a class="flex mr-3 items-center text-success" target="_blank"
                      :href="'https://wa.me/' + student.student.phone_number">
                      <Lucide icon="MessageSquare" class="w-4 h-4 mr-1" /> Mesaj Gönder
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </Dialog.Description>
        <Dialog.Footer>
          <Button type="button" variant="outline-secondary" @click="() => {
            hideTeacherStudentStatusesModal();
          }
            " class="w-20 mr-1">
            Kapat
          </Button>
        </Dialog.Footer>
      </Dialog.Panel>
    </Dialog>
  </div>
</template>
