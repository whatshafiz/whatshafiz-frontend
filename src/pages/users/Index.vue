<script setup lang="ts">
import Datatable from "@/components/Datatable"
import { ref, inject, onBeforeMount } from "vue"
import { useRouter, useRoute } from "vue-router"
import useClipboard from 'vue-clipboard3'
import { stringToHTML } from "@/utils/helper"
import { useUserStore } from "@/stores/user"
import { useCourseStore } from "@/stores/course"
import { useWhatsappGroupStore } from "@/stores/whatsappGroup"
import userProfile from "@/assets/images/placeholders/user.png"
import maleProfile from "@/assets/images/placeholders/male.jpg"
import femaleProfile from "@/assets/images/placeholders/female.jpg"

const successNotificationToggle = inject('successNotificationToggle')
const errorNotificationToggle = inject('errorNotificationToggle')

const tableRef = ref();
const { toClipboard } = useClipboard()
const route = useRoute()
const router = useRouter()
const user = useUserStore()
const userStore = useUserStore()
const courseStore = useCourseStore()
const whatsappGroupStore = useWhatsappGroupStore()
const usersIndexUrl = ref('')
const whatsappGroup = ref({})
const course = ref({})

const props =defineProps<{
  courseId?: number
  courseName?: string
}>()

onBeforeMount(() => {
  setIndexUrl()
})

const setIndexUrl = async () => {
  if (route.query.whatsappGroupId) {
    usersIndexUrl.value = userStore.getWhatsappGroupUsersIndexURL(route.query.whatsappGroupId)
    whatsappGroup.value = await whatsappGroupStore.fetchWhatsappGroup(route.query.whatsappGroupId)
  } else if (route.query.courseId || props.courseId) {
    const courseId = route.query.courseId || props.courseId
    usersIndexUrl.value = userStore.getCourseUsersIndexURL(courseId)

    if (props.courseName) {
      course.value = { id: props.courseId, name: props.courseName }
    } else {
      course.value = await courseStore.fetchCourse(courseId)
    }
  } else {
    usersIndexUrl.value = userStore.getIndexURL
  }
}

const toggleUserBanStatus = async (user) => {
  if (await userStore.toggleUserBanStatus(user.id, !user.is_banned)) {
    successNotificationToggle('İşlem Başarılı', (user.is_banned ? 'Kullanıcı banı kaldırıldı!' : 'Kullanıcı Banlandı!'))
    tableRef.value.refreshData()
  } else {
    errorNotificationToggle('HATA', 'İşlem sırasında hata oluştu!')
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
    title: "Ad Soyad",
    responsive: 1,
    minWidth: 150,
    field: "name",
    vertAlign: "middle",
    formatter(cell) {
      const response: Response = cell.getData();
      return `<div class="font-medium whitespace-nowrap">${response.name} ${response.surname}</div>`;
    },
  },
  {
    title: "Cinsiyet",
    responsive: 3,
    width: 110,
    field: "gender",
    vertAlign: "middle",
    hozAlign: "center",
    formatter(cell) {
      const rowData = cell.getData()
      const genderImage = rowData.gender === 'male' ? maleProfile :
        (rowData.gender === 'female' ? femaleProfile : userProfile)

      return `<img alt="WhatsHafız Panel Kullanıcısı" class="rounded-full w-8" src="${genderImage}" />`;
    },
  },
  {
    title: "Durum",
    responsive: 5,
    width: 100,
    field: "is_banned",
    vertAlign: "middle",
    hozAlign: "center",
    formatter(cell) {
      const rowData = cell.getData()
      return `<div class="flex items-center lg:justify-center ${!rowData.is_banned ? "text-success" : "text-danger"}">
          </i> ${!rowData.is_banned ? "Aktif" : "Banlı"}
        </div>`;
    },
  },
  {
    title: "Telefon No",
    responsive: 8,
    width: 220,
    field: "phone_number",
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
        stringToHTML(`<a class="flex items-center mr-3 text-success" target="_blank" href="https://wa.me/${rowData.phone_number}">
                          <i data-lucide="message-square" class="w-4 h-4 mr-1"></i> Mesaj Gönder
                      </a>`);

      copyButton.addEventListener("click", function (button) {
        toClipboard(rowData.phone_number)
        successNotificationToggle('Telefon No kopyalandı.', rowData.phone_number)
      });

      buttonsHolder.append(copyButton)
      buttonsHolder.append(joinButton)

      return buttonsHolder
    },
  },
  {
    title: "İŞLEMLER",
    width: 300,
    field: "actions",
    responsive: 10,
    hozAlign: "left",
    headerHozAlign: "center",
    vertAlign: "middle",
    headerSort: false,
    formatter(cell) {
      const rowData = cell.getData()
      const buttonsHolder = stringToHTML(`<div class="flex items-center lg:justify-center"></div>`);
      const showButton = stringToHTML(`<a class="flex items-center mr-3" href="javascript:;">
                                          <i data-lucide="eye" class="w-4 h-4 mr-1"></i> Görüntüle
                                      </a>`);
      const banButton = stringToHTML(`<a class="flex items-center text-danger" href="javascript:;">
                          <i data-lucide="${rowData.is_banned ? 'eraser' : 'trash-2'}" class="w-4 h-4 mr-1"></i>
                            ${ rowData.is_banned ? 'Ban Kaldır' : 'Banla' }
                        </a>`);
      const complaintButton = stringToHTML(`<a class="flex items-center text-warning mr-3" href="javascript:;">
                          <i data-lucide="x-octagon" class="w-4 h-4 mr-1"></i>
                            Şikayet Et
                        </a>`);

      showButton.addEventListener("click", function () {
        router.push({ name: 'users.view', params: { userId: rowData.id } })
      });
      banButton.addEventListener("click", function (event) {
        toggleUserBanStatus(rowData)
      });
      complaintButton.addEventListener("click", function () {
        router.push({ name: 'complaints.create', query: { userId: rowData.id } })
      });

      if (rowData.id !== userStore.profile.id) {
        buttonsHolder.append(complaintButton)
      }

      if (user.can('users.view')) {
        buttonsHolder.append(showButton)
      }

      if (user.can('users.delete')) {
        buttonsHolder.append(banButton)
      }
      
      return buttonsHolder
    },
  },
]
</script>

<template>
  <div v-if="usersIndexUrl">
    <div class="flex flex-col items-center mt-8 intro-y sm:flex-row">
      <h2 v-if="whatsappGroup.id" class="mr-auto text-lg font-medium">{{ whatsappGroup.name }} Grubundaki Kullanıcılar</h2>
      <h2 v-else-if="course.id" class="mr-auto text-lg font-medium">{{ course.name }} Kursundaki Kullanıcılar</h2>
      <h2 v-else class="mr-auto text-lg font-medium">Tüm Kullanıcılar</h2>
    </div>
    <datatable ref="tableRef" :index-url="usersIndexUrl" :columns="tableColumns" />
  </div>
</template>
