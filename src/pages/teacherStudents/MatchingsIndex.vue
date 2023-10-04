<script setup lang="ts">
import Datatable from "@/components/Datatable";
import Button from "@/base-components/Button";
import { ref, inject, onBeforeMount, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import useClipboard from 'vue-clipboard3'
import { stringToHTML } from "@/utils/helper";
import { useUserStore } from "@/stores/user";
import { useCourseStore } from "@/stores/course";
import { useAlertStore } from "@/stores/alert";
import userProfile from "@/assets/images/placeholders/user.png"
import maleProfile from "@/assets/images/placeholders/male.jpg"
import femaleProfile from "@/assets/images/placeholders/female.jpg"

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

const props = defineProps<{
  courseId: number
  courseName: string
}>()

onBeforeMount(() => {
  teacherStudentIndexUrl.value = courseStore.getCourseTeacherStudentsIndexURL(props.courseId)
})

const deleteteacherStudent = async (teacherStudentId) => {
  if (await courseStore.deleteteacherStudent(teacherStudentId)) {
    successNotificationToggle('İşlem Başarılı', 'Whatsapp Grubu Silindi!')
    tableRef.value.refreshData()
  } else {
    errorNotificationToggle('HATA', 'Whatsapp Grubu Silinemedi!')
  }
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
  </div>
</template>
