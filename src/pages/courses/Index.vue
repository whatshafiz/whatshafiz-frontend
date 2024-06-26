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
import moment from 'moment';

const successNotificationToggle = inject('successNotificationToggle')
const errorNotificationToggle = inject('errorNotificationToggle')

const tableRef = ref()
const { toClipboard } = useClipboard()
const alertStore = useAlertStore()
const router = useRouter()
const route = useRoute()
const user = useUserStore()
const courseStore = useCourseStore()
const courseIndexUrl = ref('')
const isMyIndex = ref(false)

const props = defineProps<{
  myIndex?: Boolean
}>()

onBeforeMount(() => {
  setIndexUrl()
})

watch(() => route.meta, (newValue) => {
  setIndexUrl()
  setTimeout(() => {
    if (tableRef.value) {
      tableRef.value.initTabulator()
    }
  }, 100);
})

const setIndexUrl = () => {
  isMyIndex.value = !!route.meta?.isMyIndex || props.myIndex

  courseIndexUrl.value = isMyIndex.value ? courseStore.getMyIndexURL : courseStore.getIndexURL
}

const deleteCourse = async (courseId) => {
  if (await courseStore.deleteCourse(courseId)) {
    successNotificationToggle('İşlem Başarılı', 'Kurs Silindi!')
    tableRef.value.refreshData()
  } else {
    errorNotificationToggle('HATA', 'Kurs Silinemedi!')
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
    title: "Kurs Tipi",
    responsive: 1,
    width: 120,
    field: "course_type.name",
    vertAlign: "middle",
    headerSort: false
  },
  {
    title: "Adı",
    responsive: 3,
    minWidth: 130,
    field: "name",
    vertAlign: "middle",
  },
  {
    title: "Kullanıcılar",
    responsive: 4,
    width: 130,
    field: "users_count",
    vertAlign: "middle",
    hozAlign: "center",
    formatter(cell) {
      const rowData = cell.getData()
      const buttonsHolder = stringToHTML(`<div class="flex items-center lg:justify-center"></div>`);
      let usersButton = ''

      if (user.can('users.index')) {
        usersButton = stringToHTML(
          `<a class="flex items-center mr-3 text-primary hover:underline" href="javascript:;">
            <i data-lucide="users" class="w-4 h-4 mr-1"></i>
            ${rowData.users_count} Kişi
          </a>`
        );

        usersButton.addEventListener("click", function () {
          router.push({ name: 'users.index', query: { courseId: rowData.id } })
        });
      } else {
        usersButton = stringToHTML(rowData.users_count + ' Kişi');
      }

      buttonsHolder.append(usersButton)

      return buttonsHolder
    },
  },
  {
    title: "Başlama Zamanı",
    responsive: 5,
    width: 165,
    field: "start_at",
    vertAlign: "middle",
  },
  {
    title: "Başvuru Durumu",
    responsive: 6,
    width: 165,
    field: "can_be_applied",
    vertAlign: "middle",
    hozAlign: "center",
    formatter(cell) {
      const rowData = cell.getData()

      let resultText = "Başvuru Kapalı"
      let canBeApplied = rowData.can_be_applied && rowData.is_active

      if (canBeApplied) {
        if (moment(rowData.can_be_applied_until, "DD-MM-YYYY hh:mm").diff(moment(), 'minutes') > 0) {
          resultText = "Başvuru Açık"
        } else {
          canBeApplied = false
          resultText = "Süresi Geçmiş"
        }
      } else {
        resultText = rowData.is_active ? "Başvuru Kapalı" : "Pasif Kurs"
      }

      return `<div class="flex items-center lg:justify-center ${canBeApplied ? "text-success" : "text-danger"}">
          </i> ${resultText}
        </div>`;
    },
  },
  {
    title: "Son Başvuru Zamanı",
    responsive: 7,
    width: 190,
    field: "can_be_applied_until",
    vertAlign: "middle",
  },
  {
    title: "HafızOl Kabul Sınavı Zamanı",
    responsive: 15,
    width: 230,
    field: "proficiency_exam_start_time",
    vertAlign: "middle",
  },
  {
    title: "Whatsapp Duyuru Kanalı",
    responsive: 8,
    width: 170,
    field: "join_url",
    vertAlign: "middle",
    headerHozAlign: "center",
    headerSort: false,
    formatter(cell) {
      const rowData = cell.getData()

      if (!rowData.whatsapp_channel_join_url) {
        return ''
      }

      const buttonsHolder = stringToHTML(`<div class="flex items-center lg:justify-center"></div>`);
      const copyButton =
        stringToHTML(`<a class="flex items-center mr-3" href="javascript:;">
                          <i data-lucide="copy" class="w-4 h-4 mr-1"></i> Kopyala
                      </a>`);
      const joinButton =
        stringToHTML(`<a class="flex items-center mr-3 text-success" target="_blank" href="${rowData.whatsapp_channel_join_url}">
                          <i data-lucide="external-link" class="w-4 h-4 mr-1"></i> Katıl
                      </a>`);

      copyButton.addEventListener("click", function (button) {
        toClipboard(rowData.whatsapp_channel_join_url)
        successNotificationToggle('Whatsapp duyuru kanalı linki kopyalandı.', rowData.whatsapp_channel_join_url)
      });

      buttonsHolder.append(copyButton)
      buttonsHolder.append(joinButton)

      return buttonsHolder
    },
  },
  {
    title: "Durum",
    responsive: 9,
    width: 100,
    field: "is_active",
    vertAlign: "middle",
    hozAlign: "center",
    formatter(cell) {
      const rowData = cell.getData()
      return `<div class="flex items-center lg:justify-center ${rowData.is_active ? "text-success" : "text-danger"}">
          </i> ${rowData.is_active ? "Aktif" : "Pasif"}
        </div>`;
    },
  },
  {
    title: "İŞLEMLER",
    width: 230,
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
      const editButton =
        stringToHTML(`<a class="flex items-center mr-3 text-primary" href="javascript:;">
                                <i data-lucide="check-square" class="w-4 h-4 mr-1"></i> Düzenle
                            </a>`);
      const deleteButton =
        stringToHTML(`<a class="flex items-center text-danger" href="javascript:;">
                            <i data-lucide="trash-2" class="w-4 h-4 mr-1"></i> Sil
                            </a>`);

      showButton.addEventListener("click", function () {
        router.push({ name: 'courses.view', params: { courseId: rowData.id } })
      });
      editButton.addEventListener("click", function () {
        router.push({ name: 'courses.edit', params: { courseId: rowData.id } })
      });
      deleteButton.addEventListener("click", function (event) {
        alertStore.setDeleteModalPreview(true)
        alertStore.setDeleteModalAction(() => deleteCourse(rowData.id))
      });

      if (user.can('courses.view')) {
        buttonsHolder.append(showButton)
      }

      if (user.can('courses.update')) {
        buttonsHolder.append(editButton)
      }

      if (user.can('courses.delete')) {
        buttonsHolder.append(deleteButton)
      }

      return buttonsHolder
    },
  },
]
</script>

<template>
  <div v-if="user.can('courses.list') || isMyIndex">
    <div class="flex flex-col items-center mt-8 intro-y sm:flex-row">
      <h2 v-if="isMyIndex" class="mr-auto text-lg font-medium">Kurslarım</h2>
      <h2 v-else class="mr-auto text-lg font-medium">Tüm Kurslar</h2>
      <div v-if="user.can('courses.create') && !isMyIndex" class="flex w-full mt-4 sm:w-auto sm:mt-0">
        <RouterLink :to="{ name: 'courses.create' }">
          <Button variant="primary" class="mr-2 shadow-md">
            Yeni Kurs Oluştur
          </Button>
        </RouterLink>
      </div>
    </div>
    <datatable ref="tableRef" :index-url="courseIndexUrl" :columns="tableColumns" />
  </div>
</template>
